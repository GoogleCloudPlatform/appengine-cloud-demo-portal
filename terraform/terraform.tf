terraform {
  required_version = ">= 0.14.10"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 3.63.0"
    }
  }
}

data "google_billing_account" "billing_account" {
  billing_account = var.billing_account
}
