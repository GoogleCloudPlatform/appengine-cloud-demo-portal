package handler

import (
	"encoding/json"
	"net/http"

	"github.com/rs/zerolog/log"
)

// RespondJSON responds body as JSON.
func RespondJSON(w http.ResponseWriter, r *http.Request, status int, body interface{}) {
	ctx := r.Context()
	logger := log.Ctx(ctx)

	bytes, err := json.Marshal(body)
	if err != nil {
		logger.Error().Err(err).Msg("failed to marshal response body as json")
		RespondError(w, r,
			E(http.StatusInternalServerError, "internal server error",
				"failed to marshal response body as a JSON: %w", err))
		return
	}

	w.WriteHeader(status)
	if _, err := w.Write(bytes); err != nil {
		logger.Error().Err(err).Msg("failed to write json response")
	}
}
