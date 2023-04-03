CONTAINER_NAME=rentify-test-db-container
TIMEOUT_S=30

docker run \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_USER=prisma \
  -e MYSQL_PASSWORD=prisma \
  -e MYSQL_DATABASE=tests \
  -d --rm \
  --name ${CONTAINER_NAME} \
  -p 3306:3306 \
  mysql:8.0 \
  --default-authentication-plugin=mysql_native_password

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
