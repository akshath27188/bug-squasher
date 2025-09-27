import { jsx as _jsx } from "react/jsx-runtime";
export const CodeInput = (props) => {
    return (_jsx("textarea", { ...props, rows: 10, className: "w-full h-full bg-gray-950 border border-gray-700 rounded-md p-4 font-mono text-sm text-green-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y", spellCheck: "false" }));
};
