package contactcenteranalysis

import "net/http"

func (h *handler) analyzeSpeechHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("analyzeSpeechHandler"))
}
