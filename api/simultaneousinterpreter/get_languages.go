package simultaneousinterpreter

import (
	"context"
	"net/http"
	"strings"

	"cloud.google.com/go/translate"
	"golang.org/x/text/language"

	hd "github.com/nownabe/cloud-demos/api/pkg/handler"
)

type supportedLanguage struct {
	Name string `json:"name"`
	Code string `json:"code"`
}

type getLanguagesResponse struct {
	Languages []*supportedLanguage `json:"languages"`
}

func (h *handler) getLanguages(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	langs, err := h.getTranslateSupportedLanguages(ctx)
	if err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	res := &getLanguagesResponse{Languages: h.filterLanguages(langs)}

	hd.RespondJSON(w, r, http.StatusOK, res)
}

func (h *handler) getTranslateSupportedLanguages(ctx context.Context) ([]translate.Language, error) {
	langs, err := h.Translate.SupportedLanguages(ctx, language.English)
	if err != nil {
		return nil, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to Translate.SupportedLanguages: %w", err)
	}

	return langs, err
}

func (h *handler) filterLanguages(langs []translate.Language) []*supportedLanguage {
	langMap := map[string]bool{}
	for _, l := range langs {
		if _, ok := langMap[l.Tag.String()]; !ok {
			langMap[l.Tag.String()] = true
		}
	}

	filtered := []*supportedLanguage{}

	for _, l := range h.speechSupportedLanguages {
		tag := strings.Split(l.Code, " ")[0] // for Chinese
		lang := strings.Split(tag, "-")[0]

		if _, ok := langMap[lang]; ok {
			filtered = append(filtered, &supportedLanguage{
				Name: l.Name,
				Code: tag,
			})
		}
	}

	return filtered
}
