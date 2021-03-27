package simultaneousinterpreter

import (
	"net/http"

	"github.com/ShawnLabo/cloud-demos/api/client"
	"github.com/go-chi/chi/v5"
)

type handler struct {
	*client.Clients
}

// Router returns a function to route requests with chi.
func Router(clients *client.Clients) func(r chi.Router) {
	h := &handler{clients}

	return func(r chi.Router) {
		r.Get("/languages", h.getLanguages)
		r.Post("/speech:analyze", h.analyzeSpeech)
	}
}

func (h *handler) analyzeSpeech(w http.ResponseWriter, r *http.Request) {
}
