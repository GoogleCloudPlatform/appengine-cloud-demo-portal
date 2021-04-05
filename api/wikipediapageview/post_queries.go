package wikipediapageview

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/bigquery"

	hd "github.com/nownabe/cloud-demos/api/pkg/handler"
)

type postQueriesRequest struct {
	Wiki       string    `json:"wiki"`
	TitleLike  string    `json:"title_like"`
	StartDate  time.Time `json:"start_date"`
	EndDate    time.Time `json:"end_date"`
	OrderBy    string    `json:"order_by"`
	GroupBy    string    `json:"group_by"`
	QueryCache bool      `json:"query_cache"`
}

type postQueriesResponse struct {
}

func (h *handler) postQueries(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	req := &postQueriesRequest{}
	if err := hd.DecodeJSONBody(r, req); err != nil {
		hd.RespondErrorJSON(w, r, err)
		return
	}

	if req.OrderBy != "asc" && req.OrderBy != "desc" {
		hd.RespondErrorMessage(w, r,
			http.StatusBadRequest,
			"order_by can be 'asc' or 'desc'")
		return
	}

	q := h.buildQuery(req)
	q.DisableQueryCache = !req.QueryCache

	job, err := q.Run(ctx)
	if err != nil {
		hd.RespondErrorJSON(w, r, hd.Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to run query: %w", err))
	}

	hd.RespondJSON(w, r, http.StatusOK, job.ID())
}

func (h *handler) buildQuery(req *postQueriesRequest) *bigquery.Query {
	var q *bigquery.Query

	cond := []string{"datehour >= @startDate", "datehour < @endDate"}
	if req.Wiki != "" {
		cond = append(cond, "wiki = @wiki")
	}
	if req.TitleLike != "" {
		cond = append(cond, "title LIKE @titleLike")
	}

	if req.GroupBy == "title" {
		q = h.Bigquery.Query(fmt.Sprintf(`
			SELECT
				wiki,
				title,
				SUM(views) AS views
			FROM bigquery-public-data.wikipedia.pageviews_2020
			WHERE %s
			GROUP BY wiki, title
			ORDER BY views %s
			LIMIT 100
		`, strings.Join(cond, " AND "), req.OrderBy))
	} else {
		q = h.Bigquery.Query(fmt.Sprintf(`
			SELECT
				DATE(datehour) AS date,
				SUM(views) AS views
			FROM bigquery-public-data.wikipedia.pageviews_2020
			WHERE %s
			GROUP BY date
			ORDER BY views %s
			LIMIT 366
		`, strings.Join(cond, " AND "), req.OrderBy))
	}

	q.Parameters = []bigquery.QueryParameter{
		{Name: "wiki", Value: req.Wiki},
		{Name: "titleLike", Value: "%" + req.TitleLike + "%"},
		{Name: "startDate", Value: req.StartDate},
		{Name: "endDate", Value: req.EndDate.AddDate(0, 0, 1)},
	}

	return q
}
