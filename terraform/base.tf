resource "google_project" "project" {
  name            = "Cloud Demo"
  project_id      = var.project_id
  billing_account = data.google_billing_account.billing_account.id

  lifecycle {
    ignore_changes = [name]
  }
}

/*
 * Build trigger is disabled for security reason.
 *

resource "google_storage_bucket" "state" {
  project                     = google_project.project.project_id
  name                        = var.state_bucket
  location                    = "US"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}

resource "google_service_account" "terraform" {
  project      = google_project.project.project_id
  account_id   = "terraform"
  display_name = "terraform"
}

resource "google_project_iam_member" "terraform_editor" {
  project = google_project.project.project_id
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_cloudbuild_trigger" "terraform" {
  project  = google_project.project.project_id
  name     = "Terraform"
  filename = "terraform/cloudbuild.yaml"

  github {
    owner = "nownabe"
    name  = "cloud-demos"
    push {
      branch = "main"
    }
  }

  substitutions = {
    _BILLING_ACCOUNT = ""
    _STATE_BUCKET    = ""
  }

  depends_on = [
    google_project_service.cloudbuild
  ]

  lifecycle {
    ignore_changes = [substitutions]
  }
}
*/
