import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createAPIInSupabase } from "@/lib/supabase-api";
import { useUser } from "@/hooks/useUser";
import { useSTXPrice } from "@/hooks/useSTXPrice";

interface EndpointRow {
    id: string;
    endpointName: string;
    endpointPath: string;      // URL segment: "money" (no spaces, lowercase)
    originalUrl: string;        // Target URL: "https://api.example.com/v1/exchange"
    price: string;
}

// Generate URL-safe slug from API name
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '');
};

// Validate endpoint path (lowercase, no spaces)
const validateEndpointPath = (path: string): boolean => {
    return /^[a-z0-9_-]+$/.test(path);
};

const CreateAPI = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const { stxToUSD, formatUSD } = useSTXPrice();
    const [apiName, setApiName] = useState("");
    const [apiNameSlug, setApiNameSlug] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [endpoints, setEndpoints] = useState<EndpointRow[]>([
        { id: "1", endpointName: "Default Endpoint", endpointPath: "default", originalUrl: "https://api.example.com/v1/data", price: "0.005" }
    ]);
    const [creating, setCreating] = useState(false);

    // Auto-generate slug from API name
    const handleApiNameChange = (value: string) => {
        setApiName(value);
        setApiNameSlug(generateSlug(value));
    };

    const addEndpoint = () => {
        setEndpoints([
            ...endpoints,
            { id: Math.random().toString(36).substr(2, 9), endpointName: "", endpointPath: "", originalUrl: "", price: "0.005" }
        ]);
    };

    const removeEndpoint = (id: string) => {
        if (endpoints.length > 1) {
            setEndpoints(endpoints.filter(e => e.id !== id));
        }
    };

    const updateEndpoint = (id: string, field: keyof EndpointRow, value: string) => {
        // Auto-format endpoint path (lowercase, no spaces)
        if (field === 'endpointPath') {
            value = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        }
        setEndpoints(endpoints.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (userLoading || !user) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!apiName.trim()) {
            toast.error("Please enter an API name");
            return;
        }

        if (!apiNameSlug.trim()) {
            toast.error("API name slug is required");
            return;
        }

        // Validate endpoints
        for (const endpoint of endpoints) {
            if (!endpoint.endpointName.trim()) {
                toast.error("All endpoints must have a name");
                return;
            }

            if (!validateEndpointPath(endpoint.endpointPath)) {
                toast.error(`Invalid endpoint path "${endpoint.endpointPath}". Only lowercase letters, numbers, hyphens, and underscores allowed.`);
                return;
            }

            if (!endpoint.originalUrl.trim() || !endpoint.originalUrl.startsWith('http')) {
                toast.error(`Invalid target URL for "${endpoint.endpointName}". Must start with http:// or https://`);
                return;
            }

            if (!endpoint.price || parseFloat(endpoint.price) <= 0) {
                toast.error(`Invalid price for "${endpoint.endpointName}". Must be greater than 0.`);
                return;
            }
        }

        try {
            setCreating(true);
            // Frontend writes directly to Supabase
            // Backend reads from Supabase to handle x402 payments
            const response = await createAPIInSupabase(user.id, {
                apiName: apiName.trim(),
                apiNameSlug: apiNameSlug.trim(),
                imageUrl: imageUrl.trim() || null,
                endpoints: endpoints.map(e => ({
                    endpointName: e.endpointName.trim(),
                    endpointPath: e.endpointPath.trim(),
                    originalUrl: e.originalUrl.trim(),
                    price: e.price,
                })),
            });

            if (response.success) {
                toast.success("API Project created successfully!");
                navigate("/my-apis");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create API");
        } finally {
            setCreating(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
                >
                    <span className="text-sm font-medium">Back to APIs</span>
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">Create New API Project</h1>
                    <p className="text-zinc-500 font-medium">Group multiple endpoints under a single monetization unit.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-12 pb-24">
                    {/* API Info */}
                    <section className="vercel-card p-8">
                        <h2 className="text-lg font-bold mb-6">
                            General Information
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Project Name</Label>
                                <Input
                                    value={apiName}
                                    onChange={(e) => handleApiNameChange(e.target.value)}
                                    placeholder="e.g. Finance API"
                                    className="bg-zinc-900/50 border-white/5 h-12 rounded-xl text-lg font-medium focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-zinc-600 ml-1">This will be the primary name for your API suite.</p>
                                {apiNameSlug && (
                                    <p className="text-[10px] text-zinc-500 ml-1 font-mono">
                                        URL slug: <span className="text-primary">{apiNameSlug}</span>
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">
                                    API Image URL (Optional)
                                </Label>
                                <Input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/api-logo.png"
                                    className="bg-zinc-900/50 border-white/5 h-12 rounded-xl text-lg font-medium focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-zinc-600 ml-1">
                                    Image URL for x402scan registration. Used for API discovery and branding.
                                </p>
                                {imageUrl && (
                                    <div className="mt-2">
                                        <img 
                                            src={imageUrl} 
                                            alt="API preview" 
                                            className="w-20 h-20 object-cover rounded-lg border border-white/5"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Endpoints */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                Endpoints
                            </h2>
                            <Button
                                type="button"
                                onClick={addEndpoint}
                                variant="outline"
                                className="rounded-full border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold"
                            >
                                Add Endpoint
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
                                            <div className="md:col-span-3 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Endpoint Name</Label>
                                                <Input
                                                    value={endpoint.endpointName}
                                                    onChange={(e) => updateEndpoint(endpoint.id, "endpointName", e.target.value)}
                                                    placeholder="Money Exchange"
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">URL Path</Label>
                                                <Input
                                                    value={endpoint.endpointPath}
                                                    onChange={(e) => updateEndpoint(endpoint.id, "endpointPath", e.target.value)}
                                                    placeholder="money"
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm font-mono"
                                                />
                                                {endpoint.endpointPath && !validateEndpointPath(endpoint.endpointPath) && (
                                                    <p className="text-[9px] text-red-500 ml-1">Only lowercase, numbers, hyphens, underscores</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Target URL</Label>
                                                <div className="relative">
                                                    <Input
                                                        value={endpoint.originalUrl}
                                                        onChange={(e) => updateEndpoint(endpoint.id, "originalUrl", e.target.value)}
                                                        placeholder="https://api.example.com/v1/exchange"
                                                        className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm font-mono"
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
                                                {endpoint.price && parseFloat(endpoint.price) > 0 && (
                                                    <p className="text-[10px] text-zinc-500 ml-1">
                                                        ≈ {formatUSD(stxToUSD(parseFloat(endpoint.price) || 0))}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="md:col-span-1 flex justify-center pb-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeEndpoint(endpoint.id)}
                                                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors text-xs font-bold"
                                                    disabled={endpoints.length === 1}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
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
                            disabled={creating}
                            className="bg-primary text-white hover:bg-emerald-500 font-bold px-12 h-12 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.15)] disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "Deploy Project"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateAPI;
