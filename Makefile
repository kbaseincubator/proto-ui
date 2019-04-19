serve:
	docker-compose up --build

reset:
	docker-compose down --rmi all --remove-orphans --volumes
	docker-compose build --no-cache
	docker-compose up
