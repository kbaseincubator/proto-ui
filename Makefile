serve:
	docker-compose down
	sh dev/start_server.sh

reset:
	docker-compose down --rmi all --remove-orphans --volumes
	docker-compose build --no-cache
	docker-compose up
