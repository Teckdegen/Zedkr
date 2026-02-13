import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface AddAPIModalProps {
  open: boolean;
  onClose: () => void;
}

const AddAPIModal = ({ open, onClose }: AddAPIModalProps) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Add New API</h2>
              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">API Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome API" className="mt-1 bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Endpoint URL</Label>
                <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://api.example.com/v1" className="mt-1 bg-secondary border-border font-mono text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Price per Call (STX)</Label>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.005" type="number" step="0.001" className="mt-1 bg-secondary border-border" />
              </div>
              <Button type="submit" className="w-full">Register API</Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAPIModal;
