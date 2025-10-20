import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { X, Fullscreen, FullscreenExit, Trash, Image as ImageIcon, XCircle } from 'react-bootstrap-icons';
import { getHistory, sendMessage, sendMessageWithImage, clearChat } from '../services/authApi';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface ChatBotProps {
  user: User | null;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const ChatBot = ({ user, onToggleFullscreen, isFullscreen = false }: ChatBotProps) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique app identifier from environment or generate one
  const APP_ID = import.meta.env.VITE_APP_ID || 'ai-assistant-app';

  // Load chat history from localStorage (user-specific + app-specific)
  useEffect(() => {
    if (user?.uid) {
      const storageKey = `${APP_ID}_chatHistory_${user.uid}`;
      const savedHistory = localStorage.getItem(storageKey);
      console.log('DEBUG: Loading from localStorage:', storageKey, savedHistory);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          console.log('DEBUG: Parsed localStorage history:', parsedHistory);
          setChatHistory(parsedHistory);
        } catch (error) {
          console.error('Error parsing saved chat history:', error);
        }
      }
    }
  }, [user?.uid, APP_ID]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (user?.uid && chatHistory.length > 0) {
      const storageKey = `${APP_ID}_chatHistory_${user.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(chatHistory));
      console.log('DEBUG: Saved to localStorage:', storageKey, chatHistory);
    }
  }, [chatHistory, user?.uid, APP_ID]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    const displayMessage = selectedImage 
      ? `${message || 'Sent an image'} 🖼️`
      : message;
    
    const userMessage = { 
      role: 'user', 
      content: displayMessage, 
      timestamp: new Date().toISOString(),
      hasImage: !!selectedImage
    };
    const newChatHistory = [...chatHistory, userMessage];
    console.log('DEBUG: Adding user message:', userMessage);
    console.log('DEBUG: New chat history after user message:', newChatHistory);
    
    setChatHistory(newChatHistory);
    const currentMessage = message;
    const currentImage = selectedImage;
    setMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(true);

    try {
      let response;
      
      if (currentImage) {
        // Send message with image
        response = await sendMessageWithImage(currentMessage || 'What is in this image?', currentImage);
      } else {
        // Send text-only message
        response = await sendMessage(currentMessage);
      }
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.reply,
        timestamp: new Date().toISOString()
      };
      const finalChatHistory = [...newChatHistory, assistantMessage];
      console.log('DEBUG: Adding assistant message:', assistantMessage);
      console.log('DEBUG: Final chat history:', finalChatHistory);
      
      setChatHistory(finalChatHistory);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, something went wrong.',
        timestamp: new Date().toISOString()
      };
      setChatHistory([...newChatHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      try {
        setLoading(true);
        await clearChat();
        setChatHistory([]);
        // Also clear localStorage with app-specific key
        if (user?.uid) {
          const storageKey = `${APP_ID}_chatHistory_${user.uid}`;
          localStorage.removeItem(storageKey);
          console.log('Chat history cleared successfully:', storageKey);
        }
      } catch (error) {
        console.error('Error clearing chat history:', error);
        alert('Failed to clear chat history. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const chatContainerStyle: React.CSSProperties = {
    height: isFullscreen ? 'calc(100vh - 120px)' : '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '10px',
    scrollBehavior: 'smooth'
  };

  const messageStyle = (role: string): React.CSSProperties => ({
    margin: '10px 0',
    padding: '12px 16px',
    borderRadius: '18px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    ...(role === 'user' 
      ? {
          backgroundColor: '#007bff',
          color: 'white',
          marginLeft: 'auto',
          textAlign: 'right'
        }
      : {
          backgroundColor: 'white',
          color: '#333',
          marginRight: 'auto',
          textAlign: 'left',
          border: '1px solid #e9ecef'
        })
  });

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card
      className={isFullscreen ? 'fullscreen-chat' : ''}
      style={isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        borderRadius: 0,
        margin: 0,
        backgroundColor: '#ffffff'
      } : {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">AI Assistant</h5>
        <div className="d-flex gap-2">
          {chatHistory.length > 0 && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleClearChat}
              disabled={loading}
              title="Clear chat history"
            >
              <Trash size={16} />
            </Button>
          )}
          {onToggleFullscreen && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={onToggleFullscreen}
              style={{ padding: '4px' }}
            >
              {isFullscreen ? <FullscreenExit size={16} /> : <Fullscreen size={16} />}
            </Button>
          )}
          {isFullscreen && onToggleFullscreen && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={onToggleFullscreen}
              style={{ padding: '4px' }}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body style={{ padding: isFullscreen ? '20px' : '15px', position: 'relative', backgroundColor: '#ffffff' }}>
        <div ref={chatContainerRef} style={chatContainerStyle}>
          {chatHistory.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              Start a conversation with the AI assistant!
            </div>
          )}
          
          {chatHistory.map((chat, index) => (
            <div key={`${chat.timestamp || index}-${index}`} style={messageStyle(chat.role)}>
              <div style={{ fontSize: '0.8em', opacity: 0.7, marginBottom: '4px' }}>
                {chat.role === 'user' ? 'You' : 'Assistant'}
                {chat.timestamp && (
                  <span style={{ marginLeft: '8px' }}>
                    {formatTime(chat.timestamp)}
                  </span>
                )}
              </div>
              <div>{chat.content}</div>
            </div>
          ))}
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spinner animation="border" size="sm" />
              <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
                Assistant is thinking...
              </div>
            </div>
          )}
        </div>
        
        {imagePreview && (
          <div style={{ 
            marginBottom: '10px', 
            position: 'relative', 
            display: 'inline-block',
            backgroundColor: '#f8f9fa',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                borderRadius: '4px',
                display: 'block'
              }} 
            />
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                padding: '4px 8px',
                borderRadius: '50%'
              }}
            >
              <XCircle size={16} />
            </Button>
          </div>
        )}
        
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              style={{
                borderRadius: '20px 0 0 20px',
                borderColor: '#dee2e6',
                padding: '8px 12px'
              }}
              title="Attach image"
            >
              <ImageIcon size={18} />
            </Button>
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedImage ? "Ask about the image..." : "Type your message..."}
              style={{ borderRadius: '0' }}
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || (!message.trim() && !selectedImage)} 
              style={{ 
                borderRadius: '0 20px 20px 0',
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                borderColor: '#7c3aed',
                boxShadow: '0 6px 14px rgba(124,58,237,0.35)',
                marginLeft: 6,
                color: '#ffffff',
                padding: '8px 16px',
                lineHeight: 1.2,
                fontWeight: 600,
                flex: '0 0 auto'
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatBot;
