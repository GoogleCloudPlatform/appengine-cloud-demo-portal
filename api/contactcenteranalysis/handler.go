package contactcenteranalysis

import (
	"github.com/ShawnLabo/cloud-demos/api/client"
	"github.com/go-chi/chi/v5"
)

type handler struct {
	*client.Clients
}

// Router returns a function to route request with chi.
func Router(clients *client.Clients) func(r chi.Router) {
	h := &handler{clients}

	return func(r chi.Router) {
		r.Get("/languages", h.getLanguagesHandler)
		r.Post("/speech:analyze", h.analyzeSpeechHandler)
	}
}
