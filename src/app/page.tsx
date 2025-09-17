'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileText, MessageCircle, Send, Loader2, X, Plus, Settings } from 'lucide-react';
import SettingsModal from './components/SettingsModal';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface DocumentData {
  name: string;
  content: string;
  size: number;
}

export default function Home() {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState('phi3');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = useCallback(async (file: File) => {
    const allowedTypes = ['pdf', 'text', 'plain'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedType = allowedTypes.some(type => 
      file.type.includes(type) || fileExtension === type || fileExtension === 'txt'
    );
    
    if (!isAllowedType) {
      alert('Please upload a PDF or text file (.pdf, .txt)');
      return;
    }

    console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    console.log('FormData created, sending request...');

    try {
      console.log('Sending fetch request...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        console.log('Response not OK, parsing error...');
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      console.log('Parsing response JSON...');
      const result = await response.json();
      console.log('Response parsed successfully, setting document...');
      
      setDocument({
        name: file.name,
        content: result.content,
        size: file.size,
      });
      setMessages([]);
      console.log('Document set successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      console.log('Upload process completed');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    console.log('File dropped:', e.dataTransfer.files);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log('Dropped file:', files[0].name);
      handleFileUpload(files[0]);
    } else {
      console.log('No files dropped');
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('File selected:', files[0].name);
      handleFileUpload(files[0]);
    } else {
      console.log('No files selected');
    }
  }, [handleFileUpload]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !document || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          documentContent: document.content,
          conversationHistory: messages,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Chat request failed with status ${response.status}`);
      }

      const result = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Ollama service is not available')) {
          errorContent = 'Ollama is not running. Please start Ollama with a lightweight model:\n\nollama pull tinyllama\nollama serve\n\nOr use cloud APIs in settings.';
        } else if (error.message.includes('Missing required fields')) {
          errorContent = 'Please upload a document first before asking questions.';
        } else {
          errorContent = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearDocument = () => {
    setDocument(null);
    setMessages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startNewConversation = () => {
    setDocument(null);
    setMessages([]);
    setInputMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              TextLens
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="AI Model Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload a document and chat with it using AI
          </p>
        </div>

        {!document ? (
          <div className="max-w-2xl mx-auto">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => {
                console.log('Upload area clicked');
                fileInputRef.current?.click();
              }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload a document
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Drag and drop a PDF or text file here, or click to browse
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                <p><strong>PDF Tips:</strong></p>
                <p>• Use text-based PDFs (not scanned images)</p>
                <p>• Avoid password-protected or encrypted PDFs</p>
                <p>• If PDF fails, try converting to .txt format</p>
                <p>• For corrupted PDFs, re-save in a different app</p>
              </div>
              {isUploading && (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-blue-500">Processing document...</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">{document.name}</span>
                  <span className="ml-2 text-blue-200">
                    ({(document.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={startNewConversation}
                    className="text-blue-200 hover:text-white transition-colors flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-700"
                    title="Start new conversation"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">New</span>
                  </button>
                  <button
                    onClick={clearDocument}
                    className="text-blue-200 hover:text-white transition-colors"
                    title="Close document"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageCircle className="mx-auto h-12 w-12 mb-4" />
                      <p>Start asking questions about your document!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                        <div className="flex items-center">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t dark:border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a question about the document..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  {messages.length > 0 && (
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={startNewConversation}
                        className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Start new conversation</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}