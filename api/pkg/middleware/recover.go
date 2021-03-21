package middleware

import (
	"net/http"

	"github.com/rs/zerolog/log"
)

// Recover returns a middleware to recover from panics
func Recover() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rvr := recover(); rvr != nil && rvr != http.ErrAbortHandler {
					logger := log.Ctx(r.Context())
					logger.Error().Msgf("recover from: %v", rvr)
					http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				}
			}()

			next.ServeHTTP(w, r)
		}

		return http.HandlerFunc(fn)
	}
}
