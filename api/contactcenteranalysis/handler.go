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

package contactcenteranalysis

import (
	"github.com/go-chi/chi/v5"

	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/client"
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
