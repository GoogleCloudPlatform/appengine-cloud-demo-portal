terraform {
  required_version = ">= 0.14.10"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 3.63.0"
    }
  }
}

data "google_project" "project" {
  project_id = var.project_id
}
