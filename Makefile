.PHONY: dev dev-down prod-deploy prod-down logs rollback health-check

-include .env

# Development environment
dev:
	docker compose -f docker-compose.yml up -d

dev-down:
	docker compose -f docker-compose.yml down

# Pull images from ACR and deploy
prod-deploy:
	docker compose -f docker-compose.prod.yml pull
	docker compose -f docker-compose.prod.yml up -d
	@echo "Waiting for services to start..."

# Stop production environment
prod-down:
	docker compose -f docker-compose.prod.yml down

health-check:
	@echo "Checking backend health..."
	@curl -s http://localhost/api/health || echo "Backend health check failed"
	@echo "Checking frontend..."
	@curl -s -I http://localhost | head -n 1 || echo "Frontend check failed"

# View logs
logs:
	docker compose -f docker-compose.prod.yml logs -f

# Rollback to previous deployment (if backup exists)
rollback:
	@if [ -d "../note-app-backup-*" ]; then \
		make prod-down; \
		LATEST_BACKUP=$$(ls -td ../note-app-backup-* | head -1); \
		echo "Rolling back to $$LATEST_BACKUP"; \
		cp -r $$LATEST_BACKUP/* ./; \
		make prod-deploy; \
	else \
		echo "No backup found for rollback"; \
		exit 1; \
	fi