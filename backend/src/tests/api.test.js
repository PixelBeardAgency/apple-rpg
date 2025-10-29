// RPG Todo - Automated API Tests
// Tests backend endpoints with Supabase Auth integration

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_URL = 'http://localhost:3000';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

let authToken = null;
let testUserId = null;
let testTaskId = null;
let testLabelId = null;
const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

// Helper function to make authenticated requests
async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  return { response, data };
}

console.log('\n🧪 Starting RPG Todo API Tests...\n');
console.log('⚠️  Prerequisites:');
console.log('   - Backend running on http://localhost:3000');
console.log('   - Supabase configured\n');

describe('RPG Todo API Tests', () => {
  
  describe('Health Check', () => {
    it('should return OK status', async () => {
      const { response, data } = await apiRequest('GET', '/health');
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.status, 'ok');
      console.log('✅ Health check passed');
    });
  });

  describe('Authentication via Supabase', () => {
    it('should register a new user via Supabase', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            username: 'TestUser'
          }
        }
      });
      
      assert.ok(!error, `Registration failed: ${error?.message}`);
      assert.ok(data.user);
      assert.ok(data.session);
      authToken = data.session.access_token;
      testUserId = data.user.id;
      console.log('✅ User registered successfully');
    });

    it('should login via Supabase', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      assert.ok(!error, `Login failed: ${error?.message}`);
      assert.ok(data.session);
      authToken = data.session.access_token;
      console.log('✅ User logged in successfully');
    });

    it('should not login with incorrect password', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: 'WrongPassword'
      });
      
      assert.ok(error, 'Should have failed with wrong password');
      console.log('✅ Invalid login rejected');
    });
  });

  describe('Tasks API', () => {
    it('should create a high priority task', async () => {
      const { response, data } = await apiRequest('POST', '/api/tasks', {
        title: 'Test High Priority Task',
        description: 'Test description',
        priority: 'HIGH',
        due_date: '2025-12-31',
        label_ids: []
      });
      
      assert.strictEqual(response.status, 201);
      assert.ok(data.task);
      assert.strictEqual(data.task.priority, 'HIGH');
      testTaskId = data.task.id;
      console.log('✅ High priority task created');
    });

    it('should create a medium priority task', async () => {
      const { response, data } = await apiRequest('POST', '/api/tasks', {
        title: 'Test Medium Priority Task',
        priority: 'MEDIUM'
      });
      
      assert.strictEqual(response.status, 201);
      assert.strictEqual(data.task.priority, 'MEDIUM');
      console.log('✅ Medium priority task created');
    });

    it('should create a low priority task', async () => {
      const { response, data } = await apiRequest('POST', '/api/tasks', {
        title: 'Test Low Priority Task',
        priority: 'LOW'
      });
      
      assert.strictEqual(response.status, 201);
      assert.strictEqual(data.task.priority, 'LOW');
      console.log('✅ Low priority task created');
    });

    it('should complete a task and award XP', async () => {
      const { response, data } = await apiRequest('PATCH', `/api/tasks/${testTaskId}/complete`);
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.xpEarned, 100); // High priority = 100 XP
      assert.ok(data.totalXP >= 100);
      assert.ok(Array.isArray(data.achievements));
      console.log(`✅ Task completed - Earned ${data.xpEarned} XP`);
      
      // Check if High Priority Master achievement unlocked
      if (data.achievements.length > 0) {
        console.log(`   🏆 Achievement unlocked: ${data.achievements[0].name} (+${data.achievements[0].bonus_xp} XP)`);
      }
    });

    it('should not complete already completed task', async () => {
      const { response } = await apiRequest('PATCH', `/api/tasks/${testTaskId}/complete`);
      
      assert.strictEqual(response.status, 400);
      console.log('✅ Cannot re-complete task');
    });

    it('should require authentication', async () => {
      const tempToken = authToken;
      authToken = null;
      
      const { response } = await apiRequest('GET', '/api/tasks');
      assert.strictEqual(response.status, 401);
      
      authToken = tempToken;
      console.log('✅ Authentication required');
    });

    it('should validate required fields', async () => {
      const { response } = await apiRequest('POST', '/api/tasks', {
        description: 'No title or priority'
      });
      
      assert.strictEqual(response.status, 400);
      console.log('✅ Required fields validated');
    });
  });

  describe('Labels API', () => {
    it('should get default labels', async () => {
      const { response, data } = await apiRequest('GET', '/api/labels');
      
      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(data));
      const defaultLabels = data.filter(l => l.is_default);
      assert.ok(defaultLabels.length >= 4);
      console.log(`✅ Found ${defaultLabels.length} default labels`);
    });

    it('should create a custom label', async () => {
      const { response, data } = await apiRequest('POST', '/api/labels', {
        name: 'Test Label 1'
      });
      
      assert.strictEqual(response.status, 201);
      assert.ok(data.label);
      assert.strictEqual(data.label.name, 'Test Label 1');
      testLabelId = data.label.id;
      console.log('✅ Custom label created');
    });

    it('should create multiple labels for achievement', async () => {
      await apiRequest('POST', '/api/labels', { name: 'Test Label 2' });
      const { data } = await apiRequest('POST', '/api/labels', { name: 'Test Label 3' });
      
      // Check if Label Creator I achievement unlocked
      if (data.achievements && data.achievements.length > 0) {
        console.log(`   🏆 Achievement unlocked: ${data.achievements[0].name} (+${data.achievements[0].bonus_xp} XP)`);
      }
      console.log('✅ Multiple labels created');
    });
  });

  describe('Profile API', () => {
    it('should get user profile with progress', async () => {
      const { response, data } = await apiRequest('GET', '/api/profile');
      
      assert.strictEqual(response.status, 200);
      assert.ok(data.username);
      assert.ok(typeof data.total_xp === 'number');
      assert.ok(typeof data.current_level === 'number');
      console.log(`✅ Profile loaded - Level ${data.current_level}, ${data.total_xp} XP`);
    });
  });

  describe('Achievements API', () => {
    it('should get all achievements with earned status', async () => {
      const { response, data } = await apiRequest('GET', '/api/achievements');
      
      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(data));
      assert.strictEqual(data.length, 10);
      
      const earned = data.filter(a => a.earned);
      console.log(`✅ Achievements loaded - ${earned.length}/10 earned`);
      
      // List earned achievements
      earned.forEach(a => {
        console.log(`   🏆 ${a.name}`);
      });
    });
  });

  describe('Levels API', () => {
    it('should get all 20 levels', async () => {
      const { response, data } = await apiRequest('GET', '/api/levels');
      
      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(data));
      assert.strictEqual(data.length, 20);
      
      // Verify exponential XP formula
      assert.strictEqual(data[0].xp_required, 100);  // Level 1
      assert.strictEqual(data[1].xp_required, 183);  // Level 2
      assert.strictEqual(data[19].xp_required, 8944); // Level 20
      console.log('✅ All 20 levels loaded with correct XP requirements');
    });
  });

  describe('XP Awards', () => {
    it('should award correct XP for each priority', async () => {
      // Create and complete tasks of each priority
      const priorities = [
        { level: 'HIGH', xp: 100 },
        { level: 'MEDIUM', xp: 50 },
        { level: 'LOW', xp: 25 }
      ];

      for (const { level, xp } of priorities) {
        const { data: createData } = await apiRequest('POST', '/api/tasks', {
          title: `XP Test ${level}`,
          priority: level
        });
        
        const { data: completeData } = await apiRequest('PATCH', `/api/tasks/${createData.task.id}/complete`);
        
        assert.strictEqual(completeData.xpEarned, xp);
        console.log(`✅ ${level} priority awards ${xp} XP correctly`);
      }
    });
  });

  describe('Cleanup', () => {
    it('should delete test labels', async () => {
      if (testLabelId) {
        const { response } = await apiRequest('DELETE', `/api/labels/${testLabelId}`);
        assert.strictEqual(response.status, 200);
        console.log('✅ Test data cleaned up');
      }
    });
  });
});

console.log('\n📊 Test Summary:\n');
console.log('If all tests passed:');
console.log('  ✅ Backend API working correctly');
console.log('  ✅ Authentication flow working');
console.log('  ✅ XP system functioning');
console.log('  ✅ Achievement system functioning');
console.log('  ✅ All CRUD operations working\n');
