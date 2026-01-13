.PHONY: help install dev build clean docker-up docker-down db-generate db-migrate db-seed db-studio setup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development servers (API + Web)
	npm run dev

build: ## Build all packages
	npm run build

clean: ## Remove node_modules and build artifacts
	npm run clean

docker-up: ## Start Docker containers
	docker compose up -d

docker-down: ## Stop Docker containers
	docker compose down

db-generate: ## Generate Prisma client
	npm run db:generate

db-migrate: ## Run Prisma migrations
	npm run db:migrate

db-seed: ## Seed database with demo data
	npm run db:seed

db-studio: ## Open Prisma Studio
	npm run db:studio

setup: ## Complete setup (install, docker, migrate, seed)
	npm run setup

typecheck: ## Run TypeScript type checking
	npm run typecheck

lint: ## Run linters
	npm run lint

test: ## Run tests
	npm run test
