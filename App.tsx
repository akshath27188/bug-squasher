import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { Loader } from './components/Loader';
import { getBugFixSuggestion } from './services/geminiService';
import { ArrowRightIcon } from './components/Icons';
import { FixOutput } from './components/FixOutput';

function App() {
  const [buggyCode, setBuggyCode] = useState<string>(`function findEvenNumbers(arr) {
  const evenNumbers = [];
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] % 2) {
      evenNumbers.push(arr[i]);
    }
  }
  return evenNumbers;
}`);
  const [bugDescription, setBugDescription] = useState<string>("The function is supposed to return only even numbers, but it's returning odd numbers instead. It also throws an error sometimes.");
  const [suggestedFix, setSuggestedFix] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSquashBug = useCallback(async () => {
    if (!buggyCode || !bugDescription) {
      setError('Please provide the buggy code and a description of the bug.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestedFix('');

    try {
      const fix = await getBugFixSuggestion(buggyCode, bugDescription);
      setSuggestedFix(fix);
    // FIX: Corrected syntax error in catch block by adding the opening brace '{'. This resolves this file's errors and the related component import error in index.tsx.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [buggyCode, bugDescription]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-lg text-gray-400 mb-8">
            Of course I can help. Use this tool I built to describe your issue, and I'll generate a fix.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Column */}
            <div className="flex flex-col gap-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div>
                <label htmlFor="buggy-code" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Buggy Code
                </label>
                <CodeInput
                  id="buggy-code"
                  value={buggyCode}
                  onChange={(e) => setBuggyCode(e.target.value)}
                  placeholder="Paste your buggy code here..."
                />
              </div>
              <div>
                <label htmlFor="bug-description" className="block text-sm font-medium text-gray-300 mb-2">
                  Bug Description
                </label>
                <textarea
                  id="bug-description"
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  placeholder="Describe what's going wrong. e.g., 'The component crashes when I click the button.'"
                />
              </div>
              <button
                onClick={handleSquashBug}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    Squashing...
                  </>
                ) : (
                  <>
                    Squash Bug
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>

            {/* Output Column */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI Suggested Fix
              </label>
              <div className="flex-grow h-full">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-gray-900 rounded-md">
                    <Loader />
                    <p className="mt-4 text-gray-400">Analyzing your code and squashing the bug...</p>
                    <p className="text-xs text-gray-500 mt-2">This may take a moment.</p>
                  </div>
                ) : error ? (
                  <div className="h-full flex items-center justify-center p-4 bg-red-900/20 border border-red-500/50 rounded-md">
                    <p className="text-red-400 text-center">{error}</p>
                  </div>
                ) : (
                  <FixOutput fix={suggestedFix} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;