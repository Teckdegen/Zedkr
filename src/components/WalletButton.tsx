import { Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const WalletButton = () => {
  const [connected, setConnected] = useState(false);
  const [address] = useState("SP2J6Z...B48R");

  return (
    <Button
      onClick={() => setConnected(!connected)}
      variant={connected ? "secondary" : "default"}
      className={connected ? "font-mono text-xs" : ""}
      size="sm"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connected ? address : "Connect Wallet"}
    </Button>
  );
};

export default WalletButton;
