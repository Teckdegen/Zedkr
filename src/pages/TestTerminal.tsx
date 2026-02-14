import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Terminal, Loader2, CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { userSession } from "@/lib/stacks-auth";
import { useUser } from "@/hooks/useUser";
import Layout from "@/components/Layout";

// Import x402-stacks and axios
import { 
  wrapAxiosWithPayment, 
  privateKeyToAccount,
  decodePaymentResponse,
  getExplorerURL 
} from 'x402-stacks';
import axios from 'axios';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'info' | 'success';
  content: string;
  timestamp: Date;
}

const TestTerminal = () => {
  const { user, loading: userLoading } = useUser();
  const [endpointUrl, setEndpointUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      type: 'info',
      content: '🚀 ZedKr API Test Terminal',
      timestamp: new Date(),
    },
    {
      type: 'info',
      content: 'Enter an API endpoint URL below and click Send to test it with wallet connect payment.',
      timestamp: new Date(),
    },
    {
      type: 'info',
      content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      timestamp: new Date(),
    },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addTerminalLine = (type: TerminalLine['type'], content: string) => {
    setTerminalLines(prev => [...prev, {
      type,
      content,
      timestamp: new Date(),
    }]);
  };

  const handleTest = async () => {
    if (!endpointUrl.trim()) {
      toast.error("Please enter an endpoint URL");
      return;
    }

    // Libraries are imported, no need to check

    // Check if user is signed in
    if (!userSession.isUserSignedIn()) {
      addTerminalLine('error', '❌ Wallet not connected. Please connect your wallet first.');
      toast.error("Wallet not connected");
      return;
    }

    setIsLoading(true);
    
    try {
      // Get user's private key from Stacks Connect session
      const userData = userSession.loadUserData();
      const privateKey = userData.appPrivateKey;
      
      if (!privateKey) {
        throw new Error('Could not get private key from wallet session');
      }

      addTerminalLine('command', `📡 Making request to: ${endpointUrl}`);
      addTerminalLine('info', '💳 Payment will be handled automatically via x402 protocol...');

      // Create account from private key
      const account = privateKeyToAccount(privateKey, 'testnet');
      addTerminalLine('info', `✅ Using wallet: ${account.address}`);

      // Wrap axios with automatic x402 payment handling
      const api = wrapAxiosWithPayment(
        axios.create({
          baseURL: 'https://zedkr.up.railway.app',
          timeout: 60000,
        }),
        account
      );

      // Make the request - x402-stacks handles payment automatically
      const response = await api.get(endpointUrl);

      addTerminalLine('success', '✅ Request successful!');
      addTerminalLine('output', `📦 Response data:`);
      addTerminalLine('output', JSON.stringify(response.data, null, 2));

      // Decode payment response from headers
      const paymentResponse = decodePaymentResponse(response.headers['payment-response']);
      if (paymentResponse) {
        addTerminalLine('info', '💰 Payment Details:');
        addTerminalLine('info', `   Transaction: ${paymentResponse.transaction}`);
        addTerminalLine('info', `   Payer: ${paymentResponse.payer}`);
        addTerminalLine('info', `   Network: ${paymentResponse.network}`);
        if (getExplorerURL) {
          addTerminalLine('info', `   Explorer: ${getExplorerURL(paymentResponse.transaction, 'testnet')}`);
        }
      }

      toast.success("Request completed successfully!");
    } catch (error: any) {
      if (error.response) {
        addTerminalLine('error', `❌ Request failed: ${error.response.status} ${error.response.statusText}`);
        addTerminalLine('error', `Response: ${JSON.stringify(error.response.data, null, 2)}`);
        
        // If it's a 402, show payment instructions
        if (error.response.status === 402) {
          addTerminalLine('info', '💡 This endpoint requires payment. The x402-stacks library should handle this automatically.');
          addTerminalLine('info', '   Make sure your wallet has sufficient STX balance.');
          addTerminalLine('info', '   Get testnet STX from: https://explorer.stacks.co/sandbox/faucet');
        }
      } else {
        addTerminalLine('error', `❌ Error: ${error.message}`);
      }
      toast.error("Request failed. Check terminal for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = () => {
    const allText = terminalLines.map(line => line.content).join('\n');
    navigator.clipboard.writeText(allText);
    setCopied(true);
    toast.success("Terminal output copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTerminalLines([
      {
        type: 'info',
        content: '🚀 ZedKr API Test Terminal',
        timestamp: new Date(),
      },
      {
        type: 'info',
        content: 'Terminal cleared.',
        timestamp: new Date(),
      },
      {
        type: 'info',
        content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        timestamp: new Date(),
      },
    ]);
  };

  if (userLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">API Test Terminal</h1>
            </div>
            <p className="text-zinc-500 text-sm">
              Test your monetized API endpoints with wallet connect payment
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="vercel-card p-6 mb-6"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs uppercase font-bold text-zinc-500 mb-2 block">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="/username/api/endpoint"
                  className="w-full bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleTest();
                    }
                  }}
                />
                <p className="text-[10px] text-zinc-600 mt-2">
                  Example: /teckdegen/teck/teck
                </p>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleTest}
                  disabled={isLoading || !endpointUrl.trim()}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Terminal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="vercel-card p-0 overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold uppercase text-zinc-500">Terminal Output</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAll}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  title="Copy all"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs font-bold text-zinc-400"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className="p-6 bg-zinc-950 font-mono text-xs h-[600px] overflow-y-auto"
            >
              {terminalLines.map((line, index) => {
                const time = line.timestamp.toLocaleTimeString();
                let icon = null;
                let textColor = 'text-zinc-300';

                if (line.type === 'command') {
                  icon = <span className="text-primary">$</span>;
                  textColor = 'text-zinc-200';
                } else if (line.type === 'success') {
                  icon = <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />;
                  textColor = 'text-emerald-400';
                } else if (line.type === 'error') {
                  icon = <XCircle className="w-3 h-3 text-rose-500 inline" />;
                  textColor = 'text-rose-400';
                } else if (line.type === 'info') {
                  textColor = 'text-zinc-400';
                } else if (line.type === 'output') {
                  textColor = 'text-zinc-300';
                }

                return (
                  <div key={index} className={`mb-1 ${textColor}`}>
                    <span className="text-zinc-600 mr-2">[{time}]</span>
                    {icon && <span className="mr-2">{icon}</span>}
                    <span className="whitespace-pre-wrap">{line.content}</span>
                  </div>
                );
              })}
              {isLoading && (
                <div className="text-zinc-500">
                  <Loader2 className="w-3 h-3 animate-spin inline mr-2" />
                  Processing request...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TestTerminal;

