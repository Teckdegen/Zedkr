import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getUserAPIsFromSupabase, updateAPIInSupabase, updateEndpointInSupabase, deleteEndpointFromSupabase } from "@/lib/supabase-api";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useSTXPrice } from "@/hooks/useSTXPrice";

interface EndpointRow {
    id: string;
    endpointName: string;
    endpointPath: string;      // URL segment: "money" (read-only, cannot change)
    originalUrl: string;        // Target URL (can be updated)
    price: string;              // Price in STX (can be updated)
    monetizedUrl?: string;     // Monetized URL (read-only, set by backend)
    isExisting?: boolean;      // True if endpoint exists in DB, false if new
}

// Validate endpoint path
const validateEndpointPath = (path: string): boolean => {
    return /^[a-z0-9_-]+$/.test(path);
};

const EditAPI = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const { stxToUSD, formatUSD } = useSTXPrice();
    const [apiName, setApiName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [endpoints, setEndpoints] = useState<EndpointRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchAPI = async () => {
            if (userLoading || !user || !id) return;

            try {
                setLoading(true);
                // Frontend reads directly from Supabase
                const apis = await getUserAPIsFromSupabase(user.id);
                const api = apis.find((a: any) => a.id === id);
                if (api) {
                    setApiName(api.api_name);
                    setImageUrl(api.image_url || "");
                    setEndpoints((api.endpoints || []).map((e: any) => ({
                        id: e.id,
                        endpointName: e.endpoint_name || '',
                        endpointPath: e.endpoint_path || '', // Read-only
                        originalUrl: e.original_url || '',
                        price: ((e.price_microstx / 1000000) || 0).toString(),
                        monetizedUrl: e.monetized_url || '', // Read-only, set by backend
                        isExisting: true, // Mark as existing endpoint
                    })));
                } else {
                    toast.error("API not found");
                    navigate("/my-apis");
                }
            } catch (error: any) {
                toast.error("Failed to load API");
                navigate("/my-apis");
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, [id, user, userLoading, navigate]);

    const addEndpoint = () => {
        setEndpoints([
            ...endpoints,
            { 
                id: Math.random().toString(36).substr(2, 9), 
                endpointName: "", 
                endpointPath: "", 
                originalUrl: "", 
                price: "0.005",
                isExisting: false // Mark as new endpoint
            }
        ]);
    };

    const removeEndpoint = (id: string) => {
        // Remove from form (if not saved yet, it's just removed from UI)
        setEndpoints(endpoints.filter(e => e.id !== id));
    };

    const deleteEndpoint = async (endpointId: string) => {
        if (!user || !id) return;
        
        if (confirm("Are you sure you want to delete this endpoint? This cannot be undone.")) {
            try {
                // Delete from Supabase
                await deleteEndpointFromSupabase(user.id, id, endpointId);
                // Remove from UI
                setEndpoints(endpoints.filter(e => e.id !== endpointId));
                toast.success("Endpoint deleted successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete endpoint");
            }
        }
    };

    const updateEndpoint = (id: string, field: keyof EndpointRow, value: string) => {
        // Auto-format endpoint path (lowercase, no spaces)
        if (field === 'endpointPath') {
            value = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        }
        setEndpoints(endpoints.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!apiName.trim()) {
            toast.error("Please enter an API name");
            return;
        }

        // Validate endpoints
        for (const endpoint of endpoints) {
            if (!endpoint.endpointName.trim()) {
                toast.error("All endpoints must have a name");
                return;
            }

            // Only validate endpoint path for new endpoints (existing ones can't change path)
            if (!endpoint.isExisting && !validateEndpointPath(endpoint.endpointPath)) {
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
            setUpdating(true);
            if (!user || !id) return;

            // Update API name and image URL
            await updateAPIInSupabase(user.id, id, {
                apiName: apiName.trim(),
                imageUrl: imageUrl.trim() || null,
            });

            // Update existing endpoints individually (original_url and price only)
            const existingEndpoints = endpoints.filter(e => e.isExisting);
            for (const endpoint of existingEndpoints) {
                await updateEndpointInSupabase(user.id, id, endpoint.id, {
                    endpointName: endpoint.endpointName.trim(),
                    originalUrl: endpoint.originalUrl.trim(),
                    price: endpoint.price,
                });
            }

            // Create new endpoints
            const newEndpoints = endpoints.filter(e => !e.isExisting);
            if (newEndpoints.length > 0) {
                // Get API to get api_name_slug for validation
                const apis = await getUserAPIsFromSupabase(user.id);
                const api = apis.find((a: any) => a.id === id);
                
                if (api) {
                    const endpointsData = newEndpoints.map((e) => ({
                        api_id: id,
                        endpoint_name: e.endpointName.trim(),
                        endpoint_path: e.endpointPath.trim(),
                        original_url: e.originalUrl.trim(),
                        price_microstx: Math.round((parseFloat(e.price) || 0) * 1000000),
                        active: true,
                    }));

                    const { error: endpointsError } = await supabase
                        .from('endpoints')
                        .insert(endpointsData);

                    if (endpointsError) {
                        throw new Error('Failed to create new endpoints');
                    }
                }
            }

            toast.success("API Project updated successfully!");
            navigate("/my-apis");
        } catch (error: any) {
            toast.error(error.message || "Failed to update API");
        } finally {
            setUpdating(false);
        }
    };

    if (loading || userLoading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <p className="text-zinc-500">Loading...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <p className="text-zinc-500">Please connect your wallet first</p>
                </div>
            </DashboardLayout>
        );
    }

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
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">Edit API Project</h1>
                    <p className="text-zinc-500 font-medium">Modify your project settings and endpoints.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-12 pb-24">
                    <section className="vercel-card p-8">
                        <h2 className="text-lg font-bold mb-6">General Information</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Project Name</Label>
                                <Input
                                    value={apiName}
                                    onChange={(e) => setApiName(e.target.value)}
                                    placeholder="e.g. Weather Service"
                                    className="bg-zinc-900/50 border-white/5 h-12 rounded-xl text-lg font-medium focus:ring-primary/20"
                                />
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

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Endpoints</h2>
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
                                {endpoints.map((endpoint) => (
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
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">
                                                    URL Path {endpoint.isExisting && <span className="text-zinc-600">(read-only)</span>}
                                                </Label>
                                                <Input
                                                    value={endpoint.endpointPath}
                                                    onChange={(e) => {
                                                        // Only allow changes for new endpoints
                                                        if (!endpoint.isExisting) {
                                                            updateEndpoint(endpoint.id, "endpointPath", e.target.value);
                                                        }
                                                    }}
                                                    placeholder="money"
                                                    disabled={endpoint.isExisting} // Read-only for existing endpoints
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                {endpoint.isExisting && (
                                                    <p className="text-[9px] text-zinc-600 ml-1">Cannot change path. Delete and recreate to change.</p>
                                                )}
                                                {!endpoint.isExisting && endpoint.endpointPath && !validateEndpointPath(endpoint.endpointPath) && (
                                                    <p className="text-[9px] text-red-500 ml-1">Only lowercase, numbers, hyphens, underscores</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Target URL (Original)</Label>
                                                <Input
                                                    value={endpoint.originalUrl}
                                                    onChange={(e) => updateEndpoint(endpoint.id, "originalUrl", e.target.value)}
                                                    placeholder="https://api.example.com/v1/exchange"
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm font-mono"
                                                />
                                                {endpoint.monetizedUrl && (
                                                    <div className="mt-1">
                                                        <Label className="text-[9px] uppercase font-black tracking-widest text-zinc-600 ml-1">Monetized URL (read-only)</Label>
                                                        <p className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                                                            {endpoint.monetizedUrl}
                                                        </p>
                                                    </div>
                                                )}
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
                                                {endpoint.isExisting ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteEndpoint(endpoint.id)}
                                                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors text-xs font-bold"
                                                        title="Delete endpoint from database"
                                                    >
                                                        Delete
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEndpoint(endpoint.id)}
                                                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors text-xs font-bold"
                                                        disabled={endpoints.filter(e => !e.isExisting).length === 1}
                                                        title="Remove from form (not saved yet)"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
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
                            disabled={updating}
                            className="bg-emerald-500 text-white hover:bg-emerald-400 font-bold px-12 h-12 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)] disabled:opacity-50"
                        >
                            {updating ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditAPI;
