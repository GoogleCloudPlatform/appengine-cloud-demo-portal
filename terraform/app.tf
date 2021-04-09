resource "google_app_engine_application" "app" {
  project     = google_project.project.project_id
  location_id = "us-central"
}

resource "google_cloudbuild_trigger" "api" {
  project  = google_project.project.project_id
  name     = "API"
  filename = "api/cloudbuild.yaml"

  included_files = [
    "api/**"
  ]

  github {
    owner = "nownabe"
    name  = "cloud-demos"
    push {
      branch = "main"
    }
  }

  substitutions = {
  }

  depends_on = [
    google_project_service.cloudbuild
  ]

  lifecycle {
    ignore_changes = [substitutions]
  }
}

resource "google_cloudbuild_trigger" "web" {
  project  = google_project.project.project_id
  name     = "Web"
  filename = "web/cloudbuild.yaml"

  included_files = [
    "web/**"
  ]

  github {
    owner = "nownabe"
    name  = "cloud-demos"
    push {
      branch = "main"
    }
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
  project  = google_project.project.project_id
  name     = "Dispatch"
  filename = "cloudbuild-dispatch.yaml"

  included_files = [
    "dispatch.yaml"
  ]

  github {
    owner = "nownabe"
    name  = "cloud-demos"
    push {
      branch = "main"
    }
  }

  depends_on = [
    google_project_service.cloudbuild
  ]
}

resource "google_project_iam_member" "cloudbuild_appengine_addAdmin" {
  project = google_project.project.project_id
  role    = "roles/appengine.appAdmin"
  member  = "serviceAccount:${google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_project_iam_member" "cloudbuild_cloudbuild_builds_builder" {
  project = google_project.project.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_project_iam_member" "cloudbuild_iam_serviceAccountUser" {
  project = google_project.project.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_project.project.number}@cloudbuild.gserviceaccount.com"
}
