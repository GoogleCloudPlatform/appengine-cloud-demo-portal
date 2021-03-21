package handler

import (
	"encoding/json"
	"net/http"
)

// RespondJSON responds body as JSON.
func RespondJSON(w http.ResponseWriter, r *http.Request, status int, body interface{}) {
	bytes, err := json.Marshal(body)
	if err != nil {
		RespondError(w, r,
			E(http.StatusInternalServerError, "internal server error",
				"failed to marshal response body as a JSON: %w", err))
		return
	}

	w.WriteHeader(status)
	if _, err := w.Write(bytes); err != nil {
	}
}
