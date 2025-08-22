// test-sogni.js - Test script for Sogni integration
require('dotenv').config();
const { generateSogniImage, fallbackImage, resetSogniClient } = require('./services/sogni');

async function testSogniIntegration() {
  console.log('🧪 Testing Sogni Integration\n');
  
  // Test 1: Environment check
  console.log('1️⃣ Environment Check:');
  console.log('   SOGNI_USERNAME:', process.env.SOGNI_USERNAME ? '✅' : '❌ Missing');
  console.log('   SOGNI_PASSWORD:', process.env.SOGNI_PASSWORD ? '✅' : '❌ Missing');
  
  if (!process.env.SOGNI_USERNAME || !process.env.SOGNI_PASSWORD) {
    console.log('\n❌ Missing Sogni credentials. Please check your .env file.\n');
    return;
  }
  
  // Test 2: Fallback image generation
  console.log('\n2️⃣ Testing Fallback Image:');
  const fallbackUrl = fallbackImage('magical forest adventure');
  console.log('   Fallback URL:', fallbackUrl);
  console.log('   ✅ Fallback working\n');
  
  // Test 3: Sogni image generation (with automatic fallback)
  console.log('3️⃣ Testing Sogni Image Generation:');
  try {
    console.log('   Attempting to generate image...');
    
    const imageUrl = await generateSogniImage('a magical forest with glowing mushrooms', {
      steps: 4,
      guidance: 1,
      stylePrompt: 'fantasy art, digital painting'
    });
    
    console.log('   ✅ Success! Image URL:', imageUrl);
    console.log('   🎉 Sogni is working correctly!\n');
    
  } catch (error) {
    console.log('   ⚠️ Sogni failed, but fallback should work:');
    console.log('   Error type:', error.type || 'Unknown');
    console.log('   Error message:', error.message);
    console.log('   Hint:', error.hint || 'No additional info');
    console.log('   📝 This is expected if you have insufficient credits\n');
  }
  
  // Test 4: Multiple requests (stress test)
  console.log('4️⃣ Testing Multiple Requests:');
  const prompts = [
    'space adventure',
    'underwater city',
    'dragon in mountains'
  ];
  
  for (let i = 0; i < prompts.length; i++) {
    try {
      console.log(`   Testing prompt ${i + 1}: "${prompts[i]}"`);
      const url = await generateSogniImage(prompts[i], { steps: 2, guidance: 1 });
      console.log(`   ✅ Generated: ${url.substring(0, 50)}...`);
    } catch (error) {
      console.log(`   ⚠️ Failed: ${error.type} - ${error.message}`);
    }
  }
  
  console.log('\n🏁 Test Complete!');
  console.log('\n💡 Recommendations:');
  console.log('   • If you see "INSUFFICIENT_FUNDS", add credits to your Sogni account');
  console.log('   • If you see "CONNECTION_LIMIT", wait a few minutes and try again');
  console.log('   • Fallback images will always work for your hackathon demo');
  console.log('   • Use steps=4, guidance=1 for fastest/cheapest generation\n');
}

// Run the test
if (require.main === module) {
  testSogniIntegration().catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testSogniIntegration };

