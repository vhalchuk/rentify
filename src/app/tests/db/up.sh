CONTAINER_NAME=rentify-test-db-container
IMAGE_NAME=rentify-test-db-image
TIMEOUT_S=30

docker build -t ${IMAGE_NAME} -f src/app/tests/db/Dockerfile .
docker run -d --rm --name ${CONTAINER_NAME} -p 3306:3306 ${IMAGE_NAME}

# Wait for MySQL to be ready
echo "Waiting for MySQL server to be ready..."
counter=0
until docker exec ${CONTAINER_NAME} mysql -u prisma -pprisma -e 'SELECT 1' > /dev/null 2>&1; do
  sleep 1
  counter=$((counter + 1))
  if [[ ${counter} -ge ${TIMEOUT_S} ]]; then
    echo "Timeout reached, MySQL server is not ready. Exiting."
    exit 1
  fi
done
echo "MySQL server is ready"
