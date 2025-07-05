import React, { useState } from 'react';
import { Send, MessageCircle, MessageSquare, Loader2, Plus, Trash2 } from 'lucide-react';
import './App.css';

const ChatApp = () => {
  const [mode, setMode] = useState('single');
  const [singleMessage, setSingleMessage] = useState('');
  const [batchMessages, setBatchMessages] = useState(['']);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3000';

  const handleSingleChat = async () => {
    if (!singleMessage.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: singleMessage }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResponses([{
          input: singleMessage,
          output: data.response,
          step: data.step,
          timestamp: data.timestamp
        }]);
        setSingleMessage('');
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure your backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChat = async () => {
    const validMessages = batchMessages.filter(msg => msg.trim() !== '');
    if (validMessages.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: validMessages }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResponses(data.results);
        setBatchMessages(['']);
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure your backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  const addBatchMessage = () => {
    setBatchMessages([...batchMessages, '']);
  };

  const removeBatchMessage = (index) => {
    if (batchMessages.length > 1) {
      setBatchMessages(batchMessages.filter((_, i) => i !== index));
    }
  };

  const updateBatchMessage = (index, value) => {
    const newMessages = [...batchMessages];
    newMessages[index] = value;
    setBatchMessages(newMessages);
  };

  const clearResponses = () => {
    setResponses([]);
    setError('');
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <h1 className="title">LangGraph Chat</h1>
          <p className="subtitle">Powered by Llama 3.2 via LangGraph</p>
        </div>

        {/* Mode Toggle */}
        <div className="card">
          <div className="mode-toggle">
            <button
              onClick={() => setMode('single')}
              className={`mode-button ${mode === 'single' ? 'active' : ''}`}
            >
              <MessageCircle size={16} />
              Single Question
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`mode-button ${mode === 'batch' ? 'active' : ''}`}
            >
              <MessageSquare size={16} />
              Multiple Questions
            </button>
          </div>

          {/* Single Message Mode */}
          {mode === 'single' && (
            <div className="input-section">
              <div className="input-row">
                <input
                  type="text"
                  value={singleMessage}
                  onChange={(e) => setSingleMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="message-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSingleChat()}
                  disabled={loading}
                />
                <button
                  onClick={handleSingleChat}
                  disabled={loading || !singleMessage.trim()}
                  className="send-button"
                >
                  {loading ? (
                    <Loader2 size={16} className="spinner" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Batch Messages Mode */}
          {mode === 'batch' && (
            <div className="input-section">
              {batchMessages.map((message, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => updateBatchMessage(index, e.target.value)}
                    placeholder={`Question ${index + 1}...`}
                    className="message-input"
                    disabled={loading}
                  />
                  {batchMessages.length > 1 && (
                    <button
                      onClick={() => removeBatchMessage(index)}
                      className="delete-button"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <div className="batch-controls">
                <button
                  onClick={addBatchMessage}
                  className="add-button"
                  disabled={loading}
                >
                  <Plus size={16} />
                  Add Question
                </button>
                
                <button
                  onClick={handleBatchChat}
                  disabled={loading || batchMessages.every(msg => !msg.trim())}
                  className="send-button"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send All
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-card">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Responses */}
        {responses.length > 0 && (
          <div className="card">
            <div className="responses-header">
              <h2>Responses</h2>
              <button onClick={clearResponses} className="clear-button">
                Clear
              </button>
            </div>
            
            <div className="responses-list">
              {responses.map((response, index) => (
                <div key={index} className="response-item">
                  <div className="response-section">
                    <span className="response-label">Question:</span>
                    <p className="response-text">{response.input}</p>
                  </div>
                  <div className="response-section">
                    <span className="response-label">Answer:</span>
                    <p className="response-answer">{response.output}</p>
                  </div>
                  <div className="response-meta">
                    <span>Step: {response.step}</span>
                    {response.timestamp && (
                      <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatApp;