package contactcenteranalysis

import (
	"net/http"
	"time"
)

func (h *handler) getLanguagesHandler(w http.ResponseWriter, r *http.Request) {
	time.Sleep(30 * time.Second)
	w.Write([]byte("welcome"))
}
