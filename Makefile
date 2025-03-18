.PHONY: dev prod pull-deploy

# Development environment

dev:
	docker compose -f docker-compose.yml up -d

dev-down:
	docker compose -f docker-compose.yml down

# Run local build script and deploy to ACR
build-push:
	./build-push-acr.sh

# Pull images from ACR and deploy
pull-deploy:
	docker compose -f docker-compose.prod.yml pull
	docker compose -f docker-compose.prod.yml up -d

# Stop production environment
prod-down:
	docker compose -f docker-compose.prod.yml down

# View logs
logs:
	docker compose -f docker-compose.prod.yml logs -f