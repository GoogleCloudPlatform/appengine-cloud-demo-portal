package middleware

import (
	"net/http"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// RequestLogger constructs a middleware to inject logger into request context.
func RequestLogger() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			d := zerolog.Dict().
				Str("method", r.Method).
				Str("path", r.URL.Path).
				Str("uri", r.URL.String()).
				Str("host", r.Host).
				Str("remote", r.RemoteAddr)

			logger := log.Logger.With().Dict("request", d).Logger()

			next.ServeHTTP(w, r.WithContext(logger.WithContext(ctx)))

		}

		return http.HandlerFunc(fn)
	}
}
