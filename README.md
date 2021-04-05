# cloud-demos

Demos for Google Cloud

## Prerequisites

* Direnv
* Docker
* docker-compose

## Development

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
