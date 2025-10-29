#!/bin/bash

echo "🧪 Testing Username Check API"
echo "=============================="
echo ""

# Test 1: Check available username
echo "Test 1: Checking available username 'newhero999'..."
curl -s http://localhost:3000/api/auth/check-username/newhero999 | jq
echo ""

# Test 2: Check existing username (if you have one)
echo "Test 2: Checking existing username 'testuser'..."
curl -s http://localhost:3000/api/auth/check-username/testuser | jq
echo ""

# Test 3: Empty username
echo "Test 3: Checking empty username..."
curl -s http://localhost:3000/api/auth/check-username/ | jq
echo ""

echo "✅ API tests complete!"
echo ""
echo "🌐 Now test the frontend:"
echo "1. Go to http://localhost:5173/register"
echo "2. Start typing a username"
echo "3. Watch for real-time feedback:"
echo "   - Spinner while checking"
echo "   - Green checkmark if available"
echo "   - Red X if taken"
