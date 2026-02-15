import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Loader2, CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { userSession, appDetails, showConnect } from "@/lib/stacks-auth";
import { useUser } from "@/hooks/useUser";
import DashboardLayout from "@/components/DashboardLayout";
import axios from 'axios';
import { 
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  createAssetInfo,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  tupleCV,
  bufferCV,
  StacksTestnet,
  StacksMainnet,
} from '@stacks/transactions';
import { decodePaymentResponse, getExplorerURL } from 'x402-stacks';

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

  const getWalletAddress = (): string | null => {
    try {
      if (!userSession.isUserSignedIn()) {
        return null;
      }
      const userData = userSession.loadUserData();
      return userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet || null;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  };

  const signTransactionWithWallet = async (txOptions: any): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      try {
        // Import Stacks Connect transaction signing
        import('@stacks/connect').then((StacksConnect) => {
          const openSTXTransaction = (StacksConnect as any).openSTXTransaction || 
                                     (StacksConnect.default as any)?.openSTXTransaction;

          if (!openSTXTransaction) {
            // Try window global
            const windowConnect = (window as any).StacksConnect;
            const windowOpenTx = windowConnect?.openSTXTransaction;
            
            if (!windowOpenTx) {
              reject(new Error('Stacks Connect transaction signing not available. Make sure @stacks/connect is properly loaded.'));
              return;
            }

            windowOpenTx({
              ...txOptions,
              appDetails,
              userSession,
              onFinish: (data: any) => {
                resolve(data.txId || data.txid || null);
              },
              onCancel: () => {
                reject(new Error('Transaction signing cancelled by user'));
              },
            });
            return;
          }

          openSTXTransaction({
            ...txOptions,
            appDetails,
            userSession,
            onFinish: (data: any) => {
              resolve(data.txId || data.txid || null);
            },
            onCancel: () => {
              reject(new Error('Transaction signing cancelled by user'));
            },
          });
        }).catch((error) => {
          reject(new Error(`Failed to load Stacks Connect: ${error.message}`));
        });
      } catch (error: any) {
        reject(error);
      }
    });
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

    setIsLoading(true);
    
    try {
      // Ensure endpoint starts with /
      const endpointPath = trimmedCommand.startsWith('/') ? trimmedCommand : `/${trimmedCommand}`;
      const fullUrl = `https://zedkr.up.railway.app${endpointPath}`;

      addTerminalLine('info', `📡 Making request to: ${fullUrl}`);

      // Step 1: Make initial request (will get 402 Payment Required)
      let response;
      try {
        response = await axios.get(fullUrl, {
          validateStatus: (status) => status < 500, // Don't throw on 402
        });
      } catch (error: any) {
        if (error.response?.status === 402) {
          response = error.response;
        } else {
          throw error;
        }
      }

      // Step 2: Check if payment is required (402)
      if (response.status === 402) {
        addTerminalLine('info', '💳 Payment required. Parsing payment details...');
        
        // Parse x402 payment response
        const paymentHeader = response.headers['x402-payment-required'] || 
                             response.headers['payment-required'] ||
                             response.data?.payment;
        
        let paymentData;
        try {
          if (typeof paymentHeader === 'string') {
            paymentData = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
          } else {
            paymentData = paymentHeader || response.data;
          }
        } catch (e) {
          // Try direct JSON parse
          paymentData = typeof paymentHeader === 'string' ? JSON.parse(paymentHeader) : paymentHeader;
        }

        if (!paymentData || !paymentData.accepts || !paymentData.accepts[0]) {
          addTerminalLine('error', '❌ Could not parse payment details from 402 response');
          return;
        }

        const paymentInfo = paymentData.accepts[0];
        const amountMicroSTX = BigInt(paymentInfo.amount || paymentInfo.amountMicroSTX || '0');
        const payTo = paymentInfo.payTo || paymentInfo.payto;
        const network = paymentInfo.network || 'stacks:2147483648'; // testnet
        const isTestnet = network.includes('2147483648') || network.includes('testnet');

        if (!payTo) {
          addTerminalLine('error', '❌ Payment address not found in payment details');
          return;
        }

        const amountSTX = Number(amountMicroSTX) / 1000000;
        addTerminalLine('info', `💰 Payment required: ${amountSTX} STX to ${payTo}`);
        addTerminalLine('info', '🔐 Please sign the transaction in your wallet...');

        // Get wallet address
        const walletAddress = getWalletAddress();
        if (!walletAddress) {
          addTerminalLine('error', '❌ Could not get wallet address');
          return;
        }

        // Step 3: Create STX transfer transaction
        const networkConfig = isTestnet ? new StacksTestnet() : new StacksMainnet();
        
        const txOptions = {
          recipient: payTo,
          amount: amountMicroSTX.toString(),
          senderKey: '', // Not needed for wallet signing
          network: networkConfig,
          anchorMode: AnchorMode.Any,
          postConditionMode: PostConditionMode.Allow,
          memo: `x402 payment for ${endpointPath}`,
        };

        // Step 4: Sign transaction with wallet (prompts user)
        addTerminalLine('info', '⏳ Waiting for wallet signature...');
        const txId = await signTransactionWithWallet(txOptions);

        if (!txId) {
          addTerminalLine('error', '❌ Transaction signing failed or was cancelled');
          return;
        }

        addTerminalLine('success', `✅ Transaction signed! TX ID: ${txId}`);
        addTerminalLine('info', `🔗 Explorer: ${getExplorerURL(txId, isTestnet ? 'testnet' : 'mainnet')}`);

        // Step 5: Create payment signature header
        // The x402 protocol expects a payment-signature header
        // Format: base64 encoded JSON with transaction details
        const paymentSignature = Buffer.from(JSON.stringify({
          transaction: txId,
          payer: walletAddress,
          amount: amountMicroSTX.toString(),
          network: network,
        })).toString('base64');

        // Step 6: Retry request with payment signature
        addTerminalLine('info', '📤 Resubmitting request with payment signature...');
        response = await axios.get(fullUrl, {
          headers: {
            'payment-signature': paymentSignature,
          },
        });

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
            addTerminalLine('info', `   Explorer: ${getExplorerURL(paymentResponse.transaction, isTestnet ? 'testnet' : 'mainnet')}`);
          }
        }

        toast.success("Request completed successfully!");
      } else if (response.status === 200) {
        // No payment required
        addTerminalLine('success', '✅ Request successful!');
        addTerminalLine('output', `📦 Response data:`);
        addTerminalLine('output', JSON.stringify(response.data, null, 2));
      } else {
        addTerminalLine('error', `❌ Request failed: ${response.status} ${response.statusText}`);
        addTerminalLine('error', `Response: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error: any) {
      if (error.message?.includes('cancelled')) {
        addTerminalLine('error', '❌ Transaction signing cancelled by user');
      } else if (error.response) {
        addTerminalLine('error', `❌ Request failed: ${error.response.status} ${error.response.statusText}`);
        addTerminalLine('error', `Response: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        addTerminalLine('error', `❌ Error: ${error.message || 'Unknown error'}`);
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
              Type commands directly in the terminal below. Press Enter to execute. Wallet will prompt for transaction signing.
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
