package simultaneousinterpreter

import (
	"github.com/go-chi/chi/v5"

	"github.com/nownabe/cloud-demos/api/client"
)

type handler struct {
	*client.Clients
}

// Router returns a function to route requests with chi.
func Router(clients *client.Clients) func(r chi.Router) {
	h := &handler{clients}

	return func(r chi.Router) {
		r.Get("/languages", h.getLanguages)
		r.Post("/speech:translate", h.translateSpeech)
	}
}
