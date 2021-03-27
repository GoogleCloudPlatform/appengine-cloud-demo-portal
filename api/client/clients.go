package client

import (
	"context"

	language "cloud.google.com/go/language/apiv1"
	speech "cloud.google.com/go/speech/apiv1"
	"cloud.google.com/go/translate"
	"golang.org/x/xerrors"
)

// Clients contains clients for google cloud services.
type Clients struct {
	Language  *language.Client
	Speech    *speech.Client
	Translate *translate.Client
}

// NewClients builds a new Clients
func NewClients(ctx context.Context) (*Clients, error) {
	c := &Clients{}
	var err error

	if c.Language, err = language.NewClient(ctx); err != nil {
		return nil, xerrors.Errorf("failed to get language client: %w", err)
	}

	if c.Speech, err = speech.NewClient(ctx); err != nil {
		return nil, xerrors.Errorf("failed to get speech client: %w", err)
	}

	if c.Translate, err = translate.NewClient(ctx); err != nil {
		return nil, xerrors.Errorf("failed to get translate client: %w", err)
	}

	return c, nil
}
