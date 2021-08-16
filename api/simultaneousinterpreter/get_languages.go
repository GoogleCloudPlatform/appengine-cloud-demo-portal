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

	"cloud.google.com/go/translate"
	"golang.org/x/text/language"

	hd "github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/handler"
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
