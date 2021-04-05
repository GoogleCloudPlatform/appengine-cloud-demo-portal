package wikipediapageview

import (
	"net/http"
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/go-chi/chi/v5"
	"google.golang.org/api/iterator"

	hd "github.com/nownabe/cloud-demos/api/pkg/handler"
)

type getJobResponse struct {
	Completed  bool               `json:"completed"`
	Error      string             `json:"error,omitempty"`
	Config     *config            `json:"config"`
	Statistics *statistics        `json:"statistics,omitempty"`
	Results    [][]bigquery.Value `json:"results,omitempty"`
}

type statistics struct {
	StartTime           time.Time `json:"start_time"`
	EndTime             time.Time `json:"end_time"`
	TotalBytesProcessed int64     `json:"total_bytes_processed"`
	CacheHit            bool      `json:"cache_hit"`
	InputRows           int64     `json:"input_rows"`
}

type config struct {
	Query      string                    `json:"query"`
	QueryCache bool                      `json:"query_cache"`
	Parameters []bigquery.QueryParameter `json:"parameters"`
}

func (h *handler) getJob(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	jobID := chi.URLParam(r, "jobID")
	job, err := h.Bigquery.JobFromID(ctx, jobID)
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to get job: %w", err))
		return
	}

	js, err := job.Status(ctx)
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to get job status: %w", err))
		return
	}

	jc, err := job.Config()
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to get job config: %w", err))
		return
	}
	qc, ok := jc.(*bigquery.QueryConfig)
	if !ok {
		hd.RespondErrorMessage(w, r,
			http.StatusBadRequest,
			"job id must be id of query job")
		return
	}

	res := &getJobResponse{
		Completed: js.Done(),
		Config: &config{
			Query:      qc.Q,
			QueryCache: !qc.DisableQueryCache,
			Parameters: qc.Parameters,
		},
	}

	if !js.Done() {
		hd.RespondJSON(w, r, http.StatusOK, res)
		return
	}

	if js.Err() != nil {
		res.Error = js.Err().Error()
		hd.RespondJSON(w, r, http.StatusOK, res)
		return
	}

	qs, ok := js.Statistics.Details.(*bigquery.QueryStatistics)
	if !ok {
		hd.RespondErrorMessage(w, r,
			http.StatusBadRequest,
			"job id must be id of query job")
		return
	}

	res.Statistics = &statistics{
		StartTime:           js.Statistics.StartTime,
		EndTime:             js.Statistics.EndTime,
		TotalBytesProcessed: js.Statistics.TotalBytesProcessed,
		CacheHit:            qs.CacheHit,
		InputRows:           qs.QueryPlan[0].RecordsRead,
	}

	it, err := job.Read(ctx)
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to read job: %w", err))
		return
	}

	results := [][]bigquery.Value{}

	for {
		var row []bigquery.Value
		err := it.Next(&row)
		if err == iterator.Done {
			break
		}
		if err != nil {
			hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
				http.StatusInternalServerError,
				http.StatusText(http.StatusInternalServerError),
				"failed to get : %w", err))
			return
		}
		results = append(results, row)
	}

	res.Results = results

	hd.RespondJSON(w, r, http.StatusOK, res)
}
