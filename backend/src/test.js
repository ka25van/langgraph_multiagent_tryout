// import app from './graph.js';

// async function runTests() {
//   console.log('🧪 Running LangGraph Tests...\n');
  
//   const testCases = [
//     {
//       name: 'Greeting Test',
//       input: 'Hello there!'
//     },
//     {
//       name: 'Help Test',
//       input: 'I need help with something'
//     },
//     {
//       name: 'General Chat Test',
//       input: 'What is the capital of France?'
//     }
//   ];
  
//   for (const testCase of testCases) {
//     console.log(`🔍 Testing: ${testCase.name}`);
//     console.log(`📨 Input: "${testCase.input}"`);
    
//     try {
//       const initialState = {
//         messages: [],
//         user_input: testCase.input,
//         response: "",
//         step: ""
//       };
      
//       const result = await app.invoke(initialState);
      
//       console.log(`✅ Success!`);
//       console.log(`📍 Step: ${result.step}`);
//       console.log(`📤 Response: "${result.response}"`);
//       console.log('─'.repeat(50));
      
//     } catch (error) {
//       console.error(`❌ Error in ${testCase.name}:`, error.message);
//       console.log('─'.repeat(50));
//     }
//   }
  
//   console.log('🎉 All tests completed!');
// }

// // Run tests if this file is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   runTests().catch(console.error);
// }

// export default runTests;