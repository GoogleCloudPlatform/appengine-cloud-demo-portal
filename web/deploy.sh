#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Set environment variables: API_HOST, API_USE_SSL

npm run build

gcloud app deploy --project "${GOOGLE_PROJECT}" --quiet
