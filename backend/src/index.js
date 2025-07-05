import express from 'express';
import app from './graph.js';
const server = express();
const PORT =  3000;
import cors from 'cors';

// Middleware
server.use(express.json());
server.use(cors())
server.use(express.urlencoded({ extended: true }));

// Basic route
server.get('/', (req, res) => {
  res.json({
    message: 'LangGraph Llama 3.2 Server is running!',
    endpoints: {
      chat: 'POST /chat',
      health: 'GET /health'
    }
  });
});

//one chat response 
server.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Message", message)
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        example: { message: 'Hello, how are you?' }
      });
    }
    
    console.log(`📨 Received message: "${message}"`);
    
    // Create initial state
    const initialState = {
      messages: [],
      user_input: message,
      response: "",
      step: ""
    };
    const result = await app.invoke(initialState);
    
    console.log(`📤 Sending response: "${result.response}"`);
    
    res.json({
      success: true,
      response: result.response,
      step: result.step,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error processing chat:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// Multiple questions and answer relevant to it
server.post('/chat/batch', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Messages array is required',
        example: { messages: ['Hello', 'How are you?'] }
      });
    }
    
    const results = [];
    
    for (const message of messages) {
      const initialState = {
        messages: [],
        user_input: message,
        response: "",
        step: ""
      };
      
      const result = await app.invoke(initialState);
      results.push({
        input: message,
        output: result.response,
        step: result.step
      });
    }
    
    res.json({
      success: true,
      results: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error processing batch chat:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default server;