docker kill postgres
docker rm postgres
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin -v `pwd`/db-init-docker:/docker-entrypoint-initdb.d -d postgres