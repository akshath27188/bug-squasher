import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { CopyIcon, CheckIcon } from './Icons.js';
const parseFix = (fix) => {
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
const formatExplanation = (text) => {
    return text
        .split('\n')
        .map((line, index) => {
        line = line.trim();
        if (line.startsWith('### ')) {
            return _jsx("h3", { className: "text-lg font-semibold text-gray-200 mt-4 mb-2", children: line.replace('### ', '') }, index);
        }
        if (line.startsWith('* ')) {
            return _jsx("li", { className: "ml-5 text-gray-400", children: line.replace('* ', '') }, index);
        }
        return line ? _jsx("p", { className: "text-gray-400 my-2", children: line }, index) : null;
    })
        .filter(Boolean);
};
export const FixOutput = ({ fix }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { code, explanation } = useMemo(() => parseFix(fix), [fix]);
    const handleCopy = async () => {
        if (!code)
            return;
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
        catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };
    if (!fix) {
        return (_jsx("div", { className: "h-full flex items-center justify-center p-4 bg-gray-900 rounded-md", children: _jsx("p", { className: "text-gray-500 text-center", children: "The suggested fix will appear here..." }) }));
    }
    return (_jsxs("div", { className: "h-full bg-gray-900 rounded-md flex flex-col overflow-y-auto", children: [_jsxs("div", { className: "bg-gray-950 rounded-t-md border border-b-0 border-gray-700 relative", children: [_jsxs("div", { className: "flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-md", children: [_jsx("span", { className: "text-xs font-sans text-gray-400", children: "Corrected Code" }), _jsxs("button", { onClick: handleCopy, className: "flex items-center gap-2 text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors", "aria-label": "Copy code to clipboard", children: [isCopied ? _jsx(CheckIcon, { className: "text-green-400" }) : _jsx(CopyIcon, {}), isCopied ? 'Copied!' : 'Copy'] })] }), _jsx("pre", { className: "p-4 text-sm font-mono text-green-300 overflow-x-auto", children: _jsx("code", { children: code }) })] }), _jsx("div", { className: "p-4 border border-gray-700 rounded-b-md flex-grow", children: _jsx("ul", { children: formatExplanation(explanation) }) })] }));
};
