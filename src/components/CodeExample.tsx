import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeExampleProps {
  endpointUrl: string;
  endpointName: string;
  priceSTX: number;
  isOpen: boolean;
  onClose: () => void;
}

const CodeExample = ({ endpointUrl, endpointName, priceSTX, isOpen, onClose }: CodeExampleProps) => {
  const [copied, setCopied] = useState(false);

  const codeExample = `import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';
import { userSession } from '@stacks/connect';

// Get user's private key from Stacks Connect session
const userData = userSession.loadUserData();
const privateKey = userData.appPrivateKey;

// Create account from private key
const account = privateKeyToAccount(privateKey, 'testnet');

// Wrap axios with automatic x402 payment handling
const api = wrapAxiosWithPayment(
  axios.create({
    baseURL: 'https://zedkr.up.railway.app',
    timeout: 60000,
  }),
  account
);

// Make paid request - payment handled automatically
const response = await api.get('${endpointUrl}');
console.log('Response:', response.data);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vercel-card max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Integration Code</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                    {endpointName} • {priceSTX.toFixed(6)} STX per call
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <pre className="text-xs font-mono text-zinc-300 bg-zinc-950 p-4 rounded-lg border border-white/5 overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
              <div className="p-6 border-t border-white/10 bg-white/[0.01]">
                <p className="text-[10px] text-zinc-500">
                  Install: <span className="font-mono text-zinc-400">npm install x402-stacks axios @stacks/connect</span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CodeExample;

