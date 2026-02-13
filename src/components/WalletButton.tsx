import { useState } from "react";

const WalletButton = () => {
  const [connected, setConnected] = useState(false);
  const [address] = useState("SP2J6Z...B48R");

  return (
    <button
      onClick={() => setConnected(!connected)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        connected
          ? "bg-secondary border border-border text-foreground font-mono text-xs"
          : "bg-foreground text-background hover:opacity-90"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${connected ? "bg-primary" : "bg-primary animate-pulse"}`} />
      {connected ? address : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;
