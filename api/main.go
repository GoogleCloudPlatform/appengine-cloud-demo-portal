package main

import (
	"context"
	"io"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/ShawnLabo/cloud-demos/api/client"
	"github.com/ShawnLabo/cloud-demos/api/contactcenteranalysis"
)

const (
	readHeaderTimeoutSecond = 60
	shutdownTimeoutSecond   = 60
)

func router(clients *client.Clients) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RealIP)
	r.Route("/api", func(r chi.Router) {
		r.Route("/v1", func(r chi.Router) {
			r.Route("/contactCenterAnalysis", contactcenteranalysis.Router(clients))
		})
	})

	return r
}

func initLogger() {
	if os.Getenv("LOG_LEVEL") != "" {
	} else {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}

	var w io.Writer
	if os.Getenv("LOG_PRETTY") == "true" {
		w = zerolog.ConsoleWriter{Out: os.Stdout}
	} else {
		w = os.Stdout
	}

	zerolog.TimeFieldFormat = time.RFC3339Nano
	log.Logger = zerolog.New(w).With().Timestamp().Caller().Logger().Hook(severityHook{})

	log.Info().Msg("initialized logger")
}

func main() {
	initLogger()

	ctx := context.Background()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	clients, err := client.NewClients(ctx)
	if err != nil {
		panic(err)
	}

	r := router(clients)

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           r,
		ReadHeaderTimeout: readHeaderTimeoutSecond * time.Second,
	}

	go func() {
		log.Info().Msgf("starting server with port %s", port)
		if err := srv.ListenAndServe(); err != nil {
			if err == http.ErrServerClosed {
				log.Info().Err(err).Msgf("stopped listening and serving")
			} else {
				log.Fatal().Err(err).Msgf("failed to start server")
			}
		}
	}()

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGTERM, syscall.SIGINT)
	log.Info().Msgf("received signal: %s", <-ch)

	ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeoutSecond*time.Second)
	defer cancel()

	log.Info().Msg("shutting down server")
	if err := srv.Shutdown(ctx); err != nil {
		log.Error().Err(err).Msgf("shutdown error")
	}

	log.Info().Msg("bye")
}

type severityHook struct{}

func (h severityHook) Run(e *zerolog.Event, level zerolog.Level, msg string) {
	if level != zerolog.NoLevel {
		var s string
		switch level {
		case zerolog.TraceLevel:
			s = "DEFAULT"
		case zerolog.DebugLevel:
			s = "DEBUG"
		case zerolog.InfoLevel:
			s = "INFO"
		case zerolog.WarnLevel:
			s = "WARNING"
		case zerolog.ErrorLevel:
			s = "ERROR"
		case zerolog.FatalLevel:
			s = "CRITICAL"
		case zerolog.PanicLevel:
			s = "EMERGENCY"
		}
		e.Str("severity", s)
	}
}
