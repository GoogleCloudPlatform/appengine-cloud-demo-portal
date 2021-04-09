resource "google_project_service" "appengine" {
  project = google_project.project.project_id
  service = "appengine.googleapis.com"
}

resource "google_project_service" "cloudbuild" {
  project = google_project.project.project_id
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "language" {
  project = google_project.project.project_id
  service = "language.googleapis.com"
}

resource "google_project_service" "speech" {
  project = google_project.project.project_id
  service = "speech.googleapis.com"
}

resource "google_project_service" "translate" {
  project = google_project.project.project_id
  service = "translate.googleapis.com"
}
