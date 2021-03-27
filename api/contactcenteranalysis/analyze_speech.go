package contactcenteranalysis

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/rs/zerolog/log"
	languagepb "google.golang.org/genproto/googleapis/cloud/language/v1"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"

	hd "github.com/nownabe/cloud-demos/api/pkg/handler"
)

type analyzeSpeechRequest struct {
	Audio struct {
		Content string `json:"content"`
	} `json:"audio"`
	Config struct {
		LanguageCode string `json:"language_code"`
	} `json:"config"`
}

type document struct {
	Content  string `json:"content"`
	Language string `json:"language"`
}

type analyzeSpeechResponse struct {
	Document          *document                            `json:"document"`
	Entities          []*languagepb.Entity                 `json:"entities"`
	DocumentSentiment *languagepb.Sentiment                `json:"document_sentiment"`
	Language          string                               `json:"language"`
	Categories        []*languagepb.ClassificationCategory `json:"categories"`
}

func (h *handler) analyzeSpeechHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	logger := log.Ctx(ctx)

	req := &analyzeSpeechRequest{}
	if err := hd.DecodeJSONBody(r, req); err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	wave, err := base64ToWave(ctx, req.Audio.Content)
	if err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	speechReq := &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:        speechpb.RecognitionConfig_LINEAR16,
			SampleRateHertz: 48000,
			LanguageCode:    req.Config.LanguageCode,
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: wave},
		},
	}

	speechRes, err := h.Speech.Recognize(ctx, speechReq)
	if err != nil {
		err := hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to requeest to Speech.Recognize: %w", err)
		hd.RespondErrorJSON(w, r, err)
		return
	}

	if len(speechRes.Results) == 0 {
		err := hd.Errorf(ctx,
			http.StatusBadRequest,
			"no text was recognized",
			"no text was recognized")
		hd.RespondErrorJSON(w, r, err)
		return
	}

	text := speechRes.Results[0].Alternatives[0].Transcript
	logger.Debug().Msgf("recognized text = '%s'", text)

	doc, err := buildDocument(ctx, req.Config.LanguageCode, text)
	if err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	languageReq := &languagepb.AnnotateTextRequest{
		Document:     doc,
		Features:     languageSupportedFeatures[doc.Language],
		EncodingType: languagepb.EncodingType_UTF8,
	}
	logger.Debug().Msgf("%+v", languageReq)

	languageRes, err := h.Language.AnnotateText(ctx, languageReq)
	if err != nil {
		err := hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to requeest to Language.AnnotateText: %w", err)
		hd.RespondErrorJSON(w, r, err)
		return
	}

	logger.Debug().Msgf("%+v", languageRes)

	res := &analyzeSpeechResponse{
		Document: &document{
			Content:  text,
			Language: doc.Language,
		},
		Entities:          languageRes.Entities,
		DocumentSentiment: languageRes.DocumentSentiment,
		Language:          req.Config.LanguageCode,
		Categories:        languageRes.Categories,
	}

	hd.RespondJSON(w, r, http.StatusOK, res)
}

func buildDocument(
	ctx context.Context,
	lang string,
	text string,
) (*languagepb.Document, error) {
	var sl *supportedLanguage
	for _, l := range supportedLanguages {
		if l.Code == lang {
			sl = l
			break
		}
	}

	if sl == nil {
		return nil, hd.Errorf(ctx,
			http.StatusBadRequest,
			fmt.Sprintf("%s is not supported", lang),
			"unsupported language code: %s", lang)
	}

	return &languagepb.Document{
		Type:     languagepb.Document_PLAIN_TEXT,
		Source:   &languagepb.Document_Content{Content: text},
		Language: sl.languageCode,
	}, nil
}

func base64ToWave(ctx context.Context, content string) ([]byte, error) {
	audio, err := base64.StdEncoding.DecodeString(content)
	if err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusBadRequest,
			"invalid encoded audio",
			"failed to decode base64: %w", err)
	}

	dir, err := ioutil.TempDir("", "contactcenteranalysis")
	if err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to create tempdir: %w", err)
	}
	defer os.RemoveAll(dir)

	srcFile := filepath.Join(dir, "src.ogg")
	dstFile := filepath.Join(dir, "dst.wav")

	if err := ioutil.WriteFile(srcFile, audio, 0644); err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to write file: %s: %w", srcFile, err)
	}

	if err := exec.Command("ffmpeg", "-i", srcFile, dstFile).Run(); err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to exec ffmpeg: %w", err)
	}

	wav, err := ioutil.ReadFile(dstFile)
	if err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to read wav file: %s: %w", dstFile, err)
	}

	return wav, nil
}
