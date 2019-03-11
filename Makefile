serve:
	docker-compose up --build

reset:
	docker-compose down
	docker-compose rm -vf
	docker-compose build --no-cache
	docker-compose up
