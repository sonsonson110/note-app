.PHONY: dev dev-down prod prod-deploy prod-down logs

# Development environment

dev:
	docker compose -f docker-compose.yml up -d

dev-down:
	docker compose -f docker-compose.yml down

# Pull images from ACR and deploy
prod-deploy:
	docker compose -f docker-compose.prod.yml pull
	docker compose -f docker-compose.prod.yml up -d

# Stop production environment
prod-down:
	docker compose -f docker-compose.prod.yml down

# View logs
logs:
	docker compose -f docker-compose.prod.yml logs -f