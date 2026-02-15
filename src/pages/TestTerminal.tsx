import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Loader2, CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { userSession } from "@/lib/stacks-auth";
import { useUser } from "@/hooks/useUser";
import DashboardLayout from "@/components/DashboardLayout";

// Import x402-stacks and axios
import { 
  wrapAxiosWithPayment, 
  privateKeyToAccount,
  decodePaymentResponse,
  getExplorerURL 
} from 'x402-stacks';
import axios from 'axios';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'info' | 'success' | 'prompt';
  content: string;
  timestamp: Date;
}

const TestTerminal = () => {
  const { user, loading: userLoading } = useUser();
  const [commandInput, setCommandInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      type: 'info',
      content: '🚀 ZedKr API Test Terminal',
      timestamp: new Date(),
    },
    {
      type: 'info',
      content: 'Type an API endpoint path and press Enter to test it with wallet connect payment.',
      timestamp: new Date(),
    },
    {
      type: 'info',
      content: 'Example: /teckdegen/teck/teck',
      timestamp: new Date(),
    },
    {
      type: 'info',
      content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      timestamp: new Date(),
    },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines, commandInput]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !userLoading) {
      inputRef.current.focus();
    }
  }, [userLoading]);

  const addTerminalLine = (type: TerminalLine['type'], content: string) => {
    setTerminalLines(prev => [...prev, {
      type,
      content,
      timestamp: new Date(),
    }]);
  };

  const getPrivateKey = (): string | null => {
    try {
      if (!userSession.isUserSignedIn()) {
        return null;
      }

      const userData = userSession.loadUserData();
      
      // Try different possible locations for the private key
      if (userData.appPrivateKey) {
        return userData.appPrivateKey;
      }
      
      // Try alternative paths
      if ((userData as any).privateKey) {
        return (userData as any).privateKey;
      }
      
      // Try getting from encryption key
      if (userData.keychain && (userData.keychain as any).appPrivateKey) {
        return (userData.keychain as any).appPrivateKey;
      }

      // Log the structure for debugging
      console.log('UserData structure:', Object.keys(userData));
      console.log('UserData:', userData);
      
      return null;
    } catch (error) {
      console.error('Error getting private key:', error);
      return null;
    }
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    
    if (!trimmedCommand) {
      return;
    }

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    // Display the command
    addTerminalLine('command', trimmedCommand);

    // Check if user is signed in
    if (!userSession.isUserSignedIn()) {
      addTerminalLine('error', '❌ Wallet not connected. Please connect your wallet first.');
      return;
    }

    // Get private key
    const privateKey = getPrivateKey();
    
    if (!privateKey) {
      addTerminalLine('error', '❌ Could not get private key from wallet session.');
      addTerminalLine('info', '   Make sure you are connected via Stacks Connect.');
      addTerminalLine('info', '   Try disconnecting and reconnecting your wallet.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Ensure endpoint starts with /
      const endpointPath = trimmedCommand.startsWith('/') ? trimmedCommand : `/${trimmedCommand}`;

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
      const response = await api.get(endpointPath);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      executeCommand(commandInput);
      setCommandInput("");
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommandInput("");
        } else {
          setHistoryIndex(newIndex);
          setCommandInput(commandHistory[newIndex]);
        }
      }
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
    setCommandInput("");
  };

  if (userLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
              Type commands directly in the terminal below. Press Enter to execute.
            </p>
          </motion.div>

          {/* Terminal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="vercel-card p-0 overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold uppercase text-zinc-500">Terminal</span>
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
              onClick={() => inputRef.current?.focus()}
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
                    {line.type !== 'prompt' && (
                      <>
                        <span className="text-zinc-600 mr-2">[{time}]</span>
                        {icon && <span className="mr-2">{icon}</span>}
                      </>
                    )}
                    <span className="whitespace-pre-wrap">{line.content}</span>
                  </div>
                );
              })}
              
              {/* Command Input Line */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-primary">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600"
                  placeholder={isLoading ? "Processing..." : "Type endpoint path and press Enter..."}
                  autoFocus
                />
                {isLoading && (
                  <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestTerminal;
