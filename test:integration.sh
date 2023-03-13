#!/bin/bash

# start docker-compose in detached mode
docker-compose up -d

# wait until the MySQL container is running
while [[ "$(docker inspect -f '{{.State.Running}}' integration-tests-prisma)" != "true" ]]; do
    echo "MySQL container is not yet running, waiting for 5 seconds..."
    sleep 5
done

# wait until the MySQL database is ready
until docker exec integration-tests-prisma mysqladmin ping --silent; do
    echo "MySQL is not yet ready, waiting for 10 seconds..."
    sleep 10
done

# run the Prisma migration and Jest tests
dotenv -e .env.test -- prisma db push
dotenv -e .env.test -v NODE_ENV=test -v SKIP_ENV_VALIDATION=true -- jest --testMatch "**/*.integration.test.{ts,tsx}"

# stop docker-compose
docker-compose down
