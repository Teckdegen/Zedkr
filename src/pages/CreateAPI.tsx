import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowLeft, Globe, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface EndpointRow {
    id: string;
    name: string;
    path: string;
    price: string;
}

const CreateAPI = () => {
    const navigate = useNavigate();
    const [apiName, setApiName] = useState("");
    const [endpoints, setEndpoints] = useState<EndpointRow[]>([
        { id: "1", name: "Default Endpoint", path: "/v1/api", price: "0.005" }
    ]);

    const addEndpoint = () => {
        setEndpoints([
            ...endpoints,
            { id: Math.random().toString(36).substr(2, 9), name: "", path: "", price: "0.005" }
        ]);
    };

    const removeEndpoint = (id: string) => {
        if (endpoints.length > 1) {
            setEndpoints(endpoints.filter(e => e.id !== id));
        }
    };

    const updateEndpoint = (id: string, field: keyof EndpointRow, value: string) => {
        setEndpoints(endpoints.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiName.trim()) {
            toast.error("Please enter an API name");
            return;
        }
        toast.success("API Project created successfully!");
        navigate("/my-apis");
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to APIs</span>
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">Create New API Project</h1>
                    <p className="text-zinc-500 font-medium">Group multiple endpoints under a single monetization unit.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-12 pb-24">
                    {/* API Info */}
                    <section className="vercel-card p-8">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            General Information
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Project Name</Label>
                                <Input
                                    value={apiName}
                                    onChange={(e) => setApiName(e.target.value)}
                                    placeholder="e.g. Weather Service"
                                    className="bg-zinc-900/50 border-white/5 h-12 rounded-xl text-lg font-medium focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-zinc-600 ml-1">This will be the primary name for your API suite.</p>
                            </div>
                        </div>
                    </section>

                    {/* Endpoints */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                Endpoints
                            </h2>
                            <Button
                                type="button"
                                onClick={addEndpoint}
                                variant="outline"
                                className="rounded-full border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold"
                            >
                                <Plus className="w-3 h-3 mr-2" /> Add Endpoint
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {endpoints.map((endpoint, index) => (
                                    <motion.div
                                        key={endpoint.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="vercel-card p-6 relative group"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                            <div className="md:col-span-4 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Endpoint Name</Label>
                                                <Input
                                                    value={endpoint.name}
                                                    onChange={(e) => updateEndpoint(endpoint.id, "name", e.target.value)}
                                                    placeholder="Current Weather"
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-5 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Path</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono">/</span>
                                                    <Input
                                                        value={endpoint.path}
                                                        onChange={(e) => updateEndpoint(endpoint.id, "path", e.target.value)}
                                                        placeholder="v1/weather"
                                                        className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm pl-6 font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">STX / Call</Label>
                                                <Input
                                                    type="number"
                                                    step="0.001"
                                                    value={endpoint.price}
                                                    onChange={(e) => updateEndpoint(endpoint.id, "price", e.target.value)}
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex justify-center pb-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeEndpoint(endpoint.id)}
                                                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                                    disabled={endpoints.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* Security / Advanced (Placeholder) */}
                    <section className="vercel-card p-8 opacity-50 cursor-not-allowed">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-zinc-500" />
                            Advanced Security
                        </h2>
                        <p className="text-xs text-zinc-500">Rate limiting and developer key rotation will be available soon in Zedkr Pro.</p>
                    </section>

                    <div className="flex items-center justify-end gap-4 pt-8">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/my-apis")}
                            className="font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary text-white hover:bg-emerald-500 font-bold px-12 h-12 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                        >
                            Deploy Project
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateAPI;
