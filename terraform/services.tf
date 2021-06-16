/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

resource "google_project_service" "appengine" {
  project = data.google_project.project.project_id
  service = "appengine.googleapis.com"
}

resource "google_project_service" "cloudbuild" {
  project = data.google_project.project.project_id
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "iap" {
  project = data.google_project.project.project_id
  service = "iap.googleapis.com"
}

resource "google_project_service" "language" {
  project = data.google_project.project.project_id
  service = "language.googleapis.com"
}

resource "google_project_service" "sourcerepo" {
  project = data.google_project.project.project_id
  service = "sourcerepo.googleapis.com"
}

resource "google_project_service" "speech" {
  project = data.google_project.project.project_id
  service = "speech.googleapis.com"
}

resource "google_project_service" "translate" {
  project = data.google_project.project.project_id
  service = "translate.googleapis.com"
}
