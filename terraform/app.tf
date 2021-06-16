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

resource "google_sourcerepo_repository" "repo" {
  name    = "cloud-demos"
  project = data.google_project.project.project_id

  depends_on = [
    google_project_service.sourcerepo
  ]
}

resource "google_app_engine_application" "app" {
  project     = data.google_project.project.project_id
  location_id = "us-central"
}

resource "google_iap_brand" "brand" {
  project           = data.google_project.project.project_id
  application_title = "Google Cloud Demo Portal"
  support_email     = var.support_email
}

resource "google_iap_web_type_app_engine_iam_member" "iap" {
  project = data.google_project.project.project_id
  app_id  = google_app_engine_application.app.app_id
  role    = "roles/iap.httpsResourceAccessor"
  member  = "domain:${var.domain}"

  depends_on = [
    google_project_service.iap
  ]
}

resource "google_cloudbuild_trigger" "api" {
  project  = data.google_project.project.project_id
  name     = "API"
  filename = "api/cloudbuild.yaml"

  included_files = [
    "api/**"
  ]

  trigger_template {
    repo_name   = google_sourcerepo_repository.repo.name
    branch_name = "main"
  }

  substitutions = {}

  depends_on = [
    google_project_service.cloudbuild
  ]

  lifecycle {
    ignore_changes = [substitutions]
  }
}

resource "google_cloudbuild_trigger" "web" {
  project  = data.google_project.project.project_id
  name     = "Web"
  filename = "web/cloudbuild.yaml"

  included_files = [
    "web/**"
  ]

  trigger_template {
    repo_name   = google_sourcerepo_repository.repo.name
    branch_name = "main"
  }

  substitutions = {
    _NEXT_PUBLIC_GA_MEASUREMENT_ID = ""
    _NEXT_PUBLIC_README_URL        = ""
  }

  depends_on = [
    google_project_service.cloudbuild
  ]

  lifecycle {
    ignore_changes = [substitutions]
  }
}

resource "google_cloudbuild_trigger" "dispatch" {
  project  = data.google_project.project.project_id
  name     = "Dispatch"
  filename = "cloudbuild-dispatch.yaml"

  included_files = [
    "dispatch.yaml"
  ]

  trigger_template {
    repo_name   = google_sourcerepo_repository.repo.name
    branch_name = "main"
  }

  depends_on = [
    google_project_service.cloudbuild
  ]
}

resource "google_project_iam_member" "cloudbuild_appengine_addAdmin" {
  project = data.google_project.project.project_id
  role    = "roles/appengine.appAdmin"
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"

  depends_on = [
    google_cloudbuild_trigger.dispatch
  ]
}

resource "google_project_iam_member" "cloudbuild_cloudbuild_builds_builder" {
  project = data.google_project.project.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"

  depends_on = [
    google_cloudbuild_trigger.dispatch
  ]
}

resource "google_project_iam_member" "cloudbuild_iam_serviceAccountUser" {
  project = data.google_project.project.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"

  depends_on = [
    google_cloudbuild_trigger.dispatch
  ]
}
