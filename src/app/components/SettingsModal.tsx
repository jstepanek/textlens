'use client';

import { useState } from 'react';
import { Settings, X, Zap, Cloud, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function SettingsModal({ isOpen, onClose, selectedModel, onModelChange }: SettingsModalProps) {
  const [aiProvider, setAiProvider] = useState('ollama');
  const [ollamaModel, setOllamaModel] = useState(selectedModel);

  if (!isOpen) return null;

  const handleSave = () => {
    // Save settings and notify parent of model change
    localStorage.setItem('aiProvider', aiProvider);
    localStorage.setItem('ollamaModel', ollamaModel);
    onModelChange(ollamaModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Model Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI Provider
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="ollama"
                  checked={aiProvider === 'ollama'}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="text-blue-600"
                />
                <Cpu className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Ollama (Local - Free)
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={aiProvider === 'openai'}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="text-blue-600"
                />
                <Cloud className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  OpenAI (Cloud - Paid)
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="anthropic"
                  checked={aiProvider === 'anthropic'}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="text-blue-600"
                />
                <Cloud className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Anthropic (Cloud - Paid)
                </span>
              </label>
            </div>
          </div>

          {aiProvider === 'ollama' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ollama Model (Lightweight Options)
              </label>
              <select
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="tinyllama">TinyLlama (1.1B) - Fastest</option>
                <option value="phi3">Phi-3 Mini (3.8B) - Balanced (Recommended)</option>
                <option value="gemma2:2b">Gemma 2B (2B) - Google</option>
                <option value="llama3.2:1b">Llama 3.2 1B (1B) - Meta</option>
                <option value="mistral">Mistral (7B) - Highest Quality</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Smaller models use less RAM and CPU
              </p>
            </div>
          )}

          {aiProvider === 'openai' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Setup:</strong> Add your OpenAI API key to environment variables
              </p>
            </div>
          )}

          {aiProvider === 'anthropic' && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                <strong>Setup:</strong> Add your Anthropic API key to environment variables
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
