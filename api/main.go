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
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/contactcenteranalysis"
	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/client"
	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/middleware"
	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/simultaneousinterpreter"
	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/wikipediapageview"
)

const (
	readHeaderTimeoutSecond = 60
	shutdownTimeoutSecond   = 60
)

func router(clients *client.Clients) http.Handler {
	r := chi.NewRouter()

	r.Use(chimiddleware.RealIP)
	r.Use(middleware.RequestLogger())
	r.Use(middleware.LogRequest())
	r.Use(middleware.Recover())

	r.Route("/api", func(r chi.Router) {
		r.Route("/v1", func(r chi.Router) {
			r.Route("/contactCenterAnalysis", contactcenteranalysis.Router(clients))
			r.Route("/simultaneousInterpreter", simultaneousinterpreter.Router(clients))
			r.Route("/wikipediaPageview", wikipediapageview.Router(clients))
		})
	})

	return r
}

func initLogger() {
	var level zerolog.Level
	if os.Getenv("LOG_LEVEL") != "" {
		l, err := zerolog.ParseLevel(os.Getenv("LOG_LEVEL"))
		if err != nil {
			panic(err)
		}
		level = l
	} else {
		level = zerolog.InfoLevel
	}
	zerolog.SetGlobalLevel(level)

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

	md, err := getMetadata(ctx)
	if err != nil {
		log.Error().Err(err).Msg("failed to get metadata from metadata server")

		// local environment must raise this error.
		md = &instanceMetadata{
			projectID: os.Getenv("PROJECT_ID"),
		}
	}

	clients, err := client.NewClients(ctx, md.projectID)
	if err != nil {
		panic(err)
	}

	r := router(clients)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

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
