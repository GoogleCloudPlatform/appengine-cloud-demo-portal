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
