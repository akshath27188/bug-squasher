import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    if (currentApiKey) {
      setApiKeyInput(currentApiKey);
    }
  }, [currentApiKey, isOpen]);

  const handleSaveClick = () => {
    if (apiKeyInput.trim()) {
      onSave(apiKeyInput.trim());
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-md m-4 p-6 text-gray-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Close settings"
          >&times;</button>
        </div>
        
        <div className="mt-6">
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-400 mb-2">
            Google Gemini API Key
          </label>
          <input 
            type="password"
            id="api-key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key"
            className="w-full bg-gray-950 border border-gray-600 rounded-md p-2 text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>
              Your key is stored securely using the <code className="bg-gray-700/50 px-1 py-0.5 rounded">chrome.storage.local</code> API and is only used to make requests directly from your browser to the Google Gemini API.
            </p>
            <p>
              It is never sent to any other server. This extension is client-side only, so your key is required for it to function.
            </p>
          </div>
          <a 
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:underline mt-2 inline-block"
          >
            Get your API Key from Google AI Studio &rarr;
          </a>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!apiKeyInput.trim()}
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
