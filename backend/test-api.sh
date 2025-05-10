#!/bin/bash

BASE_URL="http://localhost:5000/api"

# Register
echo "Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com", "password":"password123"}')

echo $REGISTER_RESPONSE | jq
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

# Test protected routes
echo -e "\nGetting user profile..."
curl -s $BASE_URL/users/me \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\nCreating task..."
TASK_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Script Task", "status":"pending"}')

echo $TASK_RESPONSE | jq
TASK_ID=$(echo $TASK_RESPONSE | jq -r '._id')

echo -e "\nGetting all tasks..."
curl -s $BASE_URL/tasks \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\nUpdating task..."
curl -s -X PUT $BASE_URL/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"completed"}' | jq

echo -e "\nDeleting task..."
curl -s -X DELETE $BASE_URL/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\nVerifying deletion..."
curl -s $BASE_URL/tasks \
  -H "Authorization: Bearer $TOKEN" | jq
