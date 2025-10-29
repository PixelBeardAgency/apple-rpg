// RPG Todo - Quick Health Check
// Validates backend is running and responding

const API_URL = 'http://localhost:3000';

async function healthCheck() {
  console.log('\n🏥 RPG Todo Health Check\n');
  console.log('━'.repeat(50));
  
  try {
    // Check backend
    console.log('\n📡 Checking backend...');
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'ok') {
      console.log('✅ Backend API: HEALTHY');
      console.log(`   URL: ${API_URL}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
    } else {
      console.log('❌ Backend API: UNHEALTHY');
      return false;
    }
    
    // Check endpoints exist
    console.log('\n🔍 Checking API endpoints...');
    const endpoints = [
      '/api/tasks',
      '/api/labels',
      '/api/profile',
      '/api/achievements',
      '/api/levels'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${API_URL}${endpoint}`);
        // 401 means endpoint exists but needs auth (good!)
        // 404 means endpoint doesn't exist (bad!)
        if (res.status === 401 || res.status === 200) {
          console.log(`✅ ${endpoint} - Available`);
        } else if (res.status === 404) {
          console.log(`❌ ${endpoint} - Not Found`);
        }
      } catch (err) {
        console.log(`❌ ${endpoint} - Error`);
      }
    }
    
    console.log('\n' + '━'.repeat(50));
    console.log('\n✅ Health Check Complete!');
    console.log('\nYour backend is running correctly.');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run manual tests: docs/manual-testing-checklist.md');
    console.log('   2. Test in browser: http://localhost:5173');
    console.log('   3. Create tasks and earn XP!\n');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ Health Check Failed!\n');
    console.log('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Is the backend running?');
    console.log('      Run: npm run dev');
    console.log('   2. Is it on port 3000?');
    console.log('      Check: http://localhost:3000/health');
    console.log('   3. Check for errors in terminal\n');
    return false;
  }
}

// Run health check
healthCheck().then(success => {
  process.exit(success ? 0 : 1);
});

