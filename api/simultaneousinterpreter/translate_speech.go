// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package simultaneousinterpreter

import (
	"context"
	"net/http"
	"strings"
	"sync"

	"cloud.google.com/go/translate"
	"golang.org/x/sync/errgroup"
	"golang.org/x/text/language"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"

	hd "github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/handler"
)

type translateSpeechRequest struct {
	Audio struct {
		Content string `json:"content"`
	} `json:"audio"`
	Config struct {
		LanguageCode string `json:"language_code"`
	} `json:"config"`
}

type translateSpeechResponse struct {
	LanguageCode string            `json:"language_code"`
	Translations map[string]string `json:"translations"`
}

func (h *handler) translateSpeech(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	req := &translateSpeechRequest{}
	if err := hd.DecodeJSONBody(r, req); err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	if req.Config.LanguageCode == "" {
		hd.RespondErrorMessage(w, r,
			http.StatusBadRequest,
			"language_code must be specified")
		return
	}

	text, err := h.speechToText(ctx, req.Config.LanguageCode, req.Audio.Content)
	if err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	translations, err := h.translate(ctx, req.Config.LanguageCode, text)
	if err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	res := &translateSpeechResponse{
		LanguageCode: req.Config.LanguageCode,
		Translations: translations,
	}

	hd.RespondJSON(w, r, http.StatusOK, res)
}

func (h *handler) translate(ctx context.Context, sourceLang, text string) (map[string]string, error) {
	sourceLangTag, err := language.Parse(strings.Split(sourceLang, "-")[0])
	if err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusBadRequest,
			"invalid language code",
			"failed language.Parse: %w", err)
	}

	langs, err := h.getTranslateSupportedLanguages(ctx)
	if err != nil {
		return nil, hd.Wrapf("failed getTranslateSupportedLanguages: %w", err)
	}

	translations := map[string]string{}
	mu := &sync.Mutex{}

	eg := &errgroup.Group{}
	for _, lang := range langs {
		if sourceLangTag == lang.Tag {
			translations[lang.Name] = text

			continue
		}

		lang := lang
		eg.Go(func() error {
			resp, err := h.Translate.Translate(ctx, []string{text}, lang.Tag, &translate.Options{
				Source: sourceLangTag,
				Format: translate.Text,
			})
			if err != nil {
				return hd.Errorf(ctx,
					http.StatusInternalServerError,
					http.StatusText(http.StatusInternalServerError),
					"failed Translate.Translate: %w", err)
			}

			mu.Lock()
			defer mu.Unlock()

			translations[lang.Name] = resp[0].Text

			return nil
		})
	}

	if err := eg.Wait(); err != nil {
		return nil, hd.Wrapf("failed to translate: %w", err)
	}

	return translations, nil
}

func (h *handler) speechToText(ctx context.Context, lang, audio string) (string, error) {
	wave, err := hd.Base64ToWave(ctx, audio)
	if err != nil {
		return "", hd.Wrapf("failed Base64ToWave: %w", err)
	}

	req := &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:        speechpb.RecognitionConfig_LINEAR16,
			SampleRateHertz: 48000,
			LanguageCode:    lang,
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: wave},
		},
	}

	res, err := h.Speech.Recognize(ctx, req)
	if err != nil {
		return "", hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed Speech.Recognize: %w", err)
	}

	if len(res.Results) == 0 {
		return "", hd.Errorf(ctx,
			http.StatusBadRequest,
			"no text was recognized",
			"no text was recognized")
	}

	return res.Results[0].Alternatives[0].Transcript, nil
}
