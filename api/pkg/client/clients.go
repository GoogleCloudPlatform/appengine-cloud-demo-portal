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

package client

import (
	"context"
	"fmt"

	"cloud.google.com/go/bigquery"
	language "cloud.google.com/go/language/apiv1"
	speech "cloud.google.com/go/speech/apiv1"
	"cloud.google.com/go/translate"
)

// Clients contains clients for google cloud services.
type Clients struct {
	Bigquery  *bigquery.Client
	Language  *language.Client
	Speech    *speech.Client
	Translate *translate.Client
}

// NewClients builds a new Clients
func NewClients(ctx context.Context, projectID string) (*Clients, error) {
	c := &Clients{}
	var err error

	if c.Bigquery, err = bigquery.NewClient(ctx, projectID); err != nil {
		return nil, fmt.Errorf("failed to get bigquery client: %w", err)
	}

	if c.Language, err = language.NewClient(ctx); err != nil {
		return nil, fmt.Errorf("failed to get language client: %w", err)
	}

	if c.Speech, err = speech.NewClient(ctx); err != nil {
		return nil, fmt.Errorf("failed to get speech client: %w", err)
	}

	if c.Translate, err = translate.NewClient(ctx); err != nil {
		return nil, fmt.Errorf("failed to get translate client: %w", err)
	}

	return c, nil
}
