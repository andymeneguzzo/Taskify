#!/bin/bash

# script to test the api endpoints, run the script with the command:
# ./test-api.sh
# this script will register a user, login the user, create a task, update the task, delete the task and verify the deletion

BASE_URL="http://localhost:5001/api"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Installing it will provide prettier JSON output."
    echo "Raw responses will be shown instead."
    JQ_INSTALLED=false
else
    JQ_INSTALLED=true
fi

# Function to display response
display_response() {
    local response=$1
    local desc=$2
    
    echo "=== $desc ==="
    echo "Raw response: $response"
    
    if [ "$JQ_INSTALLED" = true ] && [ ! -z "$response" ]; then
        echo "Formatted JSON:"
        echo "$response" | jq '.' || echo "Error parsing JSON"
    fi
    echo "=================="
}

# Register
echo "🔄 Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com", "password":"password123"}')

display_response "$REGISTER_RESPONSE" "Register Response"

# Extract token with fallback
if [ "$JQ_INSTALLED" = true ]; then
    TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
else
    # Simple extraction fallback if jq not available
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ No token received! Authentication failed."
    echo "Check your server logs for errors."
    exit 1
else
    echo "✅ Token received: ${TOKEN:0:10}..."
fi

# Test protected routes
echo -e "\n🔄 Getting user profile..."
PROFILE_RESPONSE=$(curl -s $BASE_URL/users/me \
  -H "Authorization: Bearer $TOKEN")

display_response "$PROFILE_RESPONSE" "Profile Response"

echo -e "\n🔄 Creating task..."
TASK_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Script Task", "status":"pending"}')

display_response "$TASK_RESPONSE" "Create Task Response"

# Extract task ID with fallback
if [ "$JQ_INSTALLED" = true ]; then
    TASK_ID=$(echo $TASK_RESPONSE | jq -r '._id')
else
    TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TASK_ID" ] || [ "$TASK_ID" = "null" ]; then
    echo "❌ No task ID received! Task creation failed."
    echo "Check your server logs for errors."
    TASK_ID="invalidID"
else
    echo "✅ Task created with ID: $TASK_ID"
fi

echo -e "\n🔄 Getting all tasks..."
TASKS_RESPONSE=$(curl -s $BASE_URL/tasks \
  -H "Authorization: Bearer $TOKEN")

display_response "$TASKS_RESPONSE" "Get Tasks Response"

echo -e "\n🔄 Updating task..."
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"completed"}')

display_response "$UPDATE_RESPONSE" "Update Task Response"

echo -e "\n🔄 Deleting task..."
DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN")

display_response "$DELETE_RESPONSE" "Delete Task Response"

echo -e "\n🔄 Verifying deletion..."
VERIFY_RESPONSE=$(curl -s $BASE_URL/tasks \
  -H "Authorization: Bearer $TOKEN")

display_response "$VERIFY_RESPONSE" "Verify Deletion Response"

echo -e "\n✅ Test script completed!"
