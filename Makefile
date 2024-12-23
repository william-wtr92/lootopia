SERVICE ?= dev
COMPOSE_FILE=$(if $(filter $(SERVICE),prod),docker/prod/docker-compose.prod.yml,docker/dev/docker-compose.dev.yml)
DC=docker-compose -f $(COMPOSE_FILE)

help: ## Display this help message
	@echo "List of available commands:"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-20s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Usage example:"
	@echo "  make up                 # Start services in development (default)"
	@echo "  make SERVICE=prod up    # Start services in production"

up: ## Start services (default: development)
	$(DC) up -d
	@echo "$(SERVICE) server is up and running 🚀!"

down: ## Stop services (default: development)
	$(DC) down
	@echo "$(SERVICE) server is down 🛑!"

build: ## Build or rebuild services (default: development)
	$(DC) build
	@echo "$(SERVICE) server is built 🧩!"

no-cache: ## Build services without using cache (default: development)
	$(DC) build --no-cache
	@echo "$(SERVICE) server is built without cache 🧩!"

restart: ## Restart services (default: development)
	$(DC) restart
	@echo "$(SERVICE) server is restarted 🔄!"

start: ## Start services if stopped (default: development)
	$(DC) start
	@echo "$(SERVICE) server is started 🚀!"

stop: ## Stop services (default: development)
	$(DC) stop
	@echo "$(SERVICE) server is stopped 🛑!"

logs: ## View logs for services (default: development)
	$(DC) logs -f
	@echo "Streaming logs for $(SERVICE) server 📜!"
