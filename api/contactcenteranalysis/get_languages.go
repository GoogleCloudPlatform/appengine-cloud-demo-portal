package contactcenteranalysis

import (
	"net/http"

	hd "github.com/ShawnLabo/cloud-demos/api/pkg/handler"
)

type getLanguagesHandlerResponse struct {
	Languages []*supportedLanguage `json:"languages"`
}

func (h *handler) getLanguagesHandler(w http.ResponseWriter, r *http.Request) {
	langs := &getLanguagesHandlerResponse{
		Languages: supportedLanguages,
	}
	hd.RespondJSON(w, r, http.StatusOK, langs)
}
