# cloud-demos

Demos for Google Cloud

## Deploy

Prerequisites

- Terraform
- gcloud

Configure and initialize terraform.

```bash
cd terraform
cp .envrc.example .envrc
vi .envrc
source .envrc
terraform init
```

Authenticate with gcloud.

```bash
gcloud auth application-default login
```

Apply terraform from your local environment.

```bash
terraform apply
```

When an error occurred like 'Repository mapping does not exist.', go to printed URL and connect the repository, and then retry.

Add substitutions of Cloud Build Triggers on [console](console.cloud.google.com).

Run Web trigger and then run API trigger.

## Development

Prerequisites

- Direnv
- Docker
- docker-compose

Setup git hooks.

```bash
scripts/init-git-hooks
```

Create your `.envrc`.

```bash
cp .envrc.example .envrc
vi .envrc
```

Run development servers.

```bash
docker-compose up
```
