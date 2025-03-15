.PHONY: dev prod prod-build prod-down prod-logs

dev:
	docker compose -f docker-compose.yml up -d

prod:
	docker compose -f docker-compose.prod.yml up -d

prod-build:
	docker compose -f docker-compose.prod.yml build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f