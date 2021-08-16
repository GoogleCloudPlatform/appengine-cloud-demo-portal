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

package wikipediapageview

import (
	"net/http"
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/iterator"

	hd "github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/handler"
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
	logger := log.Ctx(ctx)

	jobID := chi.URLParam(r, "jobID")

	job, err := h.Bigquery.JobFromID(ctx, jobID)
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to get job: %w", err))
		return
	}

	logger.Debug().Msgf("job: %+v", job)

	js, err := job.Status(ctx)
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to get job status: %w", err))
		return
	}

	logger.Debug().Msgf("js: %+v", job)

	jc, err := job.Config()
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to get job config: %w", err))
		return
	}

	logger.Debug().Msgf("jc: %+v", job)

	qc, ok := jc.(*bigquery.QueryConfig)
	if !ok {
		hd.RespondErrorMessage(w, r,
			http.StatusBadRequest,
			"job id must be id of query job")
		return
	}

	logger.Debug().Msgf("qc: %+v", job)

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

	logger.Debug().Msgf("qc: %+v", job)

	res.Statistics = &statistics{
		StartTime:           js.Statistics.StartTime,
		EndTime:             js.Statistics.EndTime,
		TotalBytesProcessed: js.Statistics.TotalBytesProcessed,
		CacheHit:            qs.CacheHit,
	}

	logger.Debug().Msgf("qs.QueryPlan: %+v", qs.QueryPlan)

	if qs.QueryPlan != nil && len(qs.QueryPlan) > 0 {
		res.Statistics.InputRows = qs.QueryPlan[0].RecordsRead
	} else {
		res.Statistics.InputRows = 0
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
		} else if err != nil {
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
