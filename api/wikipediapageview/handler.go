package wikipediapageview

import (
	"github.com/go-chi/chi/v5"

	"github.com/nownabe/cloud-demos/api/pkg/client"
)

type handler struct {
	*client.Clients
}

func newHandler(clients *client.Clients) *handler {
	return &handler{clients}
}

// Router returns a function to route requests with chi.
func Router(clients *client.Clients) func(r chi.Router) {
	h := newHandler(clients)

	return func(r chi.Router) {
		r.Post("/queries", h.postQueries)
	}
}
