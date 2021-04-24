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
