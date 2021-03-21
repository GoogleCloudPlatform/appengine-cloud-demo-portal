package middleware

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// LogRequest returns a middleware to log requests.
func LogRequest() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			t1 := time.Now()
			defer func() {
				ctx := r.Context()
				logger := log.Ctx(ctx)
				logger.Info().Dict("response", zerolog.Dict().
					Int("status", ww.Status()).
					Int("sent_bytes", ww.BytesWritten()).
					Int64("elapsed", time.Since(t1).Microseconds()),
				).Msgf("")
			}()

			next.ServeHTTP(ww, r)
		}

		return http.HandlerFunc(fn)
	}
}
