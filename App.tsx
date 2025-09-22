import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { FixOutput } from './components/FixOutput';
import { Loader } from './components/Loader';
import { ArrowRightIcon } from './components/Icons';
import { AdBanner } from './components/AdBanner';
import { getBugFixSuggestion } from './services/geminiService';

function App() {
  const [buggyCode, setBuggyCode] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [suggestedFix, setSuggestedFix] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Type assertion for chrome APIs
  const chrome = (window as any).chrome;

  useEffect(() => {
    // When the app loads, check if there's buggy code passed from the context menu
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['buggyCode'], function(result: { buggyCode?: string }) {
        if (result.buggyCode) {
          setBuggyCode(result.buggyCode);
          // Clear the storage so it doesn't re-populate on next load
          chrome.storage.local.remove('buggyCode');
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buggyCode.trim() || !bugDescription.trim()) {
      setError('Please provide both the buggy code and a description of the bug.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSuggestedFix('');

    try {
      const fix = await getBugFixSuggestion(buggyCode, bugDescription);
      setSuggestedFix(fix);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Input Side */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-300">Describe the Bug</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
              <div className="flex-[2_2_0%] flex flex-col">
                <label htmlFor="buggy-code" className="text-sm font-medium text-gray-400 mb-2">Buggy Code</label>
                <CodeInput 
                  id="buggy-code"
                  value={buggyCode} 
                  onChange={(e) => setBuggyCode(e.target.value)} 
                  placeholder="Paste your buggy code here..."
                />
              </div>
              <div className="flex-[1_1_0%] flex flex-col">
                 <label htmlFor="bug-description" className="text-sm font-medium text-gray-400 mb-2">Bug Description</label>
                 <textarea
                    id="bug-description"
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="Describe the bug. What did you expect to happen? What happened instead?"
                    className="w-full h-full bg-gray-950 border border-gray-700 rounded-md p-4 font-sans text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                    spellCheck="false"
                 />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !buggyCode || !bugDescription}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-colors"
              >
                {isLoading ? <><Loader /> Squashing Bug...</> : <>Squash Bug <ArrowRightIcon /></>}
              </button>
            </form>
          </div>

          {/* Output Side */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-300">Suggested Fix</h2>
            <div className="relative h-full">
               {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm rounded-md z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <span className="text-gray-400">AI is thinking...</span>
                  </div>
                </div>
              )}
              
              {error ? (
                <div className="h-full flex items-center justify-center p-4 bg-gray-900 rounded-md">
                    <p className="text-red-400 text-center">{error}</p>
                </div>
              ) : (
                <FixOutput fix={suggestedFix} />
              )}
            </div>
          </div>
        </div>
        <AdBanner />
      </main>
    </div>
  );
}

export default App;
