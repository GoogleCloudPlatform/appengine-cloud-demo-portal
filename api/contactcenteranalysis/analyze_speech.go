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

	hd "github.com/ShawnLabo/cloud-demos/api/pkg/handler"
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
		logger.Error().Err(err).Msg("failed to decode request json as json")
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
		err = hd.E(http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to requeest to Speech.Recognize: %w", err)
		logger.Error().Err(err).Msg(err.Error())
		hd.RespondErrorJSON(w, r, err)
		return
	}

	if len(speechRes.Results) == 0 {
		err := hd.Error(http.StatusBadRequest, "no text was recognized",
			"no text was recognized")
		hd.RespondErrorJSON(w, r, err)
		return
	}

	text := speechRes.Results[0].Alternatives[0].Transcript

	doc, err := buildDocument(req.Config.LanguageCode, text)
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
		err = hd.E(http.StatusInternalServerError,
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

func buildDocument(languageCode string, content string) (*languagepb.Document, error) {
	var lang *supportedLanguage
	for _, l := range supportedLanguages {
		if l.Code == languageCode {
			lang = l
			break
		}
	}

	if lang == nil {
		return nil, hd.Error(
			http.StatusBadRequest,
			fmt.Sprintf("%s is not supported", languageCode),
			fmt.Sprintf("unsupported language code: %s", languageCode))
	}

	return &languagepb.Document{
		Type:     languagepb.Document_PLAIN_TEXT,
		Source:   &languagepb.Document_Content{Content: content},
		Language: lang.languageCode,
	}, nil
}

func base64ToWave(ctx context.Context, content string) ([]byte, error) {
	logger := log.Ctx(ctx)

	audio, err := base64.StdEncoding.DecodeString(content)
	if err != nil {
		logger.Error().Err(err).Msg("failed to decode base64")
		return nil, hd.E(http.StatusBadRequest, "invalid audio",
			"failed to decode base64: %w", err)
	}

	dir, err := ioutil.TempDir("", "contactcenteranalysis")
	if err != nil {
		logger.Error().Err(err).Msg("failed to create tempdir")
		return nil, hd.E(http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to create tempdir: %w", err)
	}
	defer os.RemoveAll(dir)

	srcFile := filepath.Join(dir, "src.ogg")
	dstFile := filepath.Join(dir, "dst.wav")

	if err := ioutil.WriteFile(srcFile, audio, 0644); err != nil {
		logger.Error().Err(err).Msgf("failed to write file: %s", srcFile)
		return nil, hd.E(http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to write file: %s: %w", srcFile, err)
	}

	if err := exec.Command("ffmpeg", "-i", srcFile, dstFile).Run(); err != nil {
		logger.Error().Err(err).Msg("failed to exec ffmpeg")
		return nil, hd.E(http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to exec ffmpeg: %w", err)
	}

	wav, err := ioutil.ReadFile(dstFile)
	if err != nil {
		logger.Error().Err(err).Msgf("failed to read wave file: %s", dstFile)
		return nil, hd.E(http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to read wav file: %s: %w", dstFile, err)
	}

	return wav, nil
}
