import React, { useState, useMemo } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface FixOutputProps {
  fix: string;
}

const parseFix = (fix: string) => {
  if (!fix) {
    return { code: '', explanation: '' };
  }
  const parts = fix.split('\n---\n');
  const rawCode = parts[0] || '';
  const explanation = parts[1] || '';

  // Remove markdown code block fences (e.g., ```javascript)
  const code = rawCode.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');

  return { code, explanation };
};

const formatExplanation = (text: string) => {
  return text
    .split('\n')
    .map((line, index) => {
      line = line.trim();
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-gray-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 text-gray-400">{line.replace('* ', '')}</li>;
      }
      return line ? <p key={index} className="text-gray-400 my-2">{line}</p> : null;
    })
    .filter(Boolean);
};

export const FixOutput: React.FC<FixOutputProps> = ({ fix }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code, explanation } = useMemo(() => parseFix(fix), [fix]);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!fix) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-gray-900 rounded-md">
        <p className="text-gray-500 text-center">The suggested fix will appear here...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 rounded-md flex flex-col overflow-y-auto">
      {/* Code Block */}
      <div className="bg-gray-950 rounded-t-md border border-b-0 border-gray-700 relative">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-md">
          <span className="text-xs font-sans text-gray-400">Corrected Code</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors"
            aria-label="Copy code to clipboard"
          >
            {isCopied ? <CheckIcon className="text-green-400" /> : <CopyIcon />}
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-green-300 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
      
      {/* Explanation Block */}
      <div className="p-4 border border-gray-700 rounded-b-md flex-grow">
        <ul>{formatExplanation(explanation)}</ul>
      </div>
    </div>
  );
};
