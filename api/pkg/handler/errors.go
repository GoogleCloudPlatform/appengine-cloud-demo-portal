package handler

import (
	"fmt"
	"net/http"

	"github.com/rs/zerolog/log"
)

type httpError struct {
	err    error
	status int    // http status code
	msg    string // http response message
}

// Error returns internal message of e.
func (e *httpError) Error() string {
	return fmt.Sprintf("%s (%d): %s", e.msg, e.status, e.err)
}

// E constructs an error.
func E(status int, msg string, format string, a ...interface{}) error {
	err := fmt.Errorf(format, a...)

	e := &httpError{err: err}

	pe, ok := err.(*httpError)

	if ok {
		e.status = pe.status
		e.msg = fmt.Sprintf("%s: %s", msg, pe.msg)
	} else {
		e.status = status
		e.msg = msg
	}

	return e
}

// RespondError responds and logs error.
func RespondError(w http.ResponseWriter, r *http.Request, err error) {
	ctx := r.Context()
	logger := log.Ctx(ctx)

	e, ok := err.(*httpError)
	if ok {
		logger.Error().Err(e).Msg(e.Error())
		http.Error(w, e.msg, e.status)
	} else {
		logger.Error().Err(err).Msg("unexpected error")
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}

type errjson struct {
	Status  int    `json:"status"`
	Kind    string `json:"kind"`
	Message string `json:"message"`
}

// RespondErrorJSON responds error as JSON and logs error.
func RespondErrorJSON(w http.ResponseWriter, r *http.Request, err error) {
	ctx := r.Context()
	logger := log.Ctx(ctx)

	ej := &errjson{}

	e, ok := err.(*httpError)
	if ok {
		ej.Status = e.status
		ej.Message = e.msg
		logger.Error().Err(e).Msg(e.msg)
	} else {
		ej.Status = http.StatusInternalServerError
		ej.Message = http.StatusText(ej.Status)
		logger.Error().Err(err).Msg(ej.Message)
	}
	ej.Kind = http.StatusText(ej.Status)

	RespondJSON(w, r, ej.Status, ej)
}
