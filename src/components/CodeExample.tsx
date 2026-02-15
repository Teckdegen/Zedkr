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
  const [activeTab, setActiveTab] = useState<'direct-call' | 'wallet-connect' | 'private-key'>('direct-call');

  const walletConnectExample = `import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';
import { userSession } from '@stacks/connect';

// Get user's private key from Stacks Connect session
// This works when user has connected wallet via @stacks/connect
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
// x402-stacks will:
// 1. Make initial request (gets 402 Payment Required)
// 2. Sign payment payload with wallet
// 3. Resubmit with payment-signature header
// 4. Return API response
const response = await api.get('${endpointUrl}');
console.log('Response:', response.data);

// Payment details are in response headers
const paymentResponse = response.headers['payment-response'];
console.log('Payment transaction:', paymentResponse);`;

  const privateKeyExample = `import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';

// Your Stacks wallet private key (get from wallet settings)
// IMPORTANT: Never commit private keys to git!
// Store in environment variables or secure config
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY || 'your_private_key_here';

// Create account from private key
const account = privateKeyToAccount(PRIVATE_KEY, 'testnet');

// Wrap axios with automatic x402 payment handling
const api = wrapAxiosWithPayment(
  axios.create({
    baseURL: 'https://zedkr.up.railway.app',
    timeout: 60000,
  }),
  account
);

// Make paid request - payment handled automatically
// x402-stacks will:
// 1. Make initial request (gets 402 Payment Required)
// 2. Sign payment payload with private key
// 3. Resubmit with payment-signature header
// 4. Return API response
const response = await api.get('${endpointUrl}');
console.log('Response:', response.data);

// Payment details are in response headers
const paymentResponse = response.headers['payment-response'];
console.log('Payment transaction:', paymentResponse);`;

  const directCallExample = `# Direct API Call with Private Key
# The easiest way to test your API - just add your private key!

# Method 1: Private Key in URL (Query Parameter)
curl "${endpointUrl}?privateKey=YOUR_PRIVATE_KEY_HERE"

# Method 2: Private Key in Header (Recommended for Production)
curl -H "x-private-key: YOUR_PRIVATE_KEY_HERE" "${endpointUrl}"

# Example with actual private key:
curl "${endpointUrl}?privateKey=ed25519:your_private_key_here"

# The payment is automatically processed via x402-stacks protocol
# No code needed - just replace YOUR_PRIVATE_KEY_HERE with your Stacks private key

# Response includes payment transaction details in headers
# Check the 'payment-response' header for transaction hash and details

# ⚠️ SECURITY WARNING:
# - Never share your private key publicly
# - Never commit private keys to git
# - Use environment variables in production
# - This method is perfect for testing and AI agents`;

  const codeExample = 
    activeTab === 'direct-call' ? directCallExample :
    activeTab === 'wallet-connect' ? walletConnectExample : 
    privateKeyExample;

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
              
              {/* Tabs */}
              <div className="px-6 pt-4 border-b border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('direct-call')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                      activeTab === 'direct-call'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Direct Call
                  </button>
                  <button
                    onClick={() => setActiveTab('wallet-connect')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                      activeTab === 'wallet-connect'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Wallet Connect
                  </button>
                  <button
                    onClick={() => setActiveTab('private-key')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                      activeTab === 'private-key'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Private Key
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <pre className="text-xs font-mono text-zinc-300 bg-zinc-950 p-4 rounded-lg border border-white/5 overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
              <div className="p-6 border-t border-white/10 bg-white/[0.01]">
                {activeTab === 'direct-call' ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500">
                      <span className="text-primary font-bold">✨ Easiest Method:</span> Just add your private key to the URL or header - no code needed!
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Perfect for testing, automation, and AI agents. Payment is automatically processed via x402-stacks protocol.
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500">
                    Install: <span className="font-mono text-zinc-400">npm install x402-stacks axios{activeTab === 'wallet-connect' ? ' @stacks/connect' : ''}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CodeExample;

