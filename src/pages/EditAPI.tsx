import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { userAPIs } from "@/data/mockData";

interface EndpointRow {
    id: string;
    name: string;
    path: string;
    price: string;
}

const EditAPI = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apiName, setApiName] = useState("");
    const [endpoints, setEndpoints] = useState<EndpointRow[]>([]);

    useEffect(() => {
        const existingProject = userAPIs.find(a => a.id === id);
        if (existingProject) {
            setApiName(existingProject.name);
            setEndpoints(existingProject.endpoints.map(e => ({
                id: e.id,
                name: e.name,
                path: e.path,
                price: e.price.toString()
            })));
        } else {
            toast.error("Project not found");
            navigate("/my-apis");
        }
    }, [id, navigate]);

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

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiName.trim()) {
            toast.error("Please enter an API name");
            return;
        }

        const invalidEndpoint = endpoints.find(e => !e.path.startsWith('http'));
        if (invalidEndpoint) {
            toast.error(`Invalid URL for ${invalidEndpoint.name || 'endpoint'}. Must start with http:// or https://`);
            return;
        }

        toast.success("API Project updated successfully!");
        navigate("/my-apis");
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
                                                <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Target URL</Label>
                                                <Input
                                                    value={endpoint.path}
                                                    onChange={(e) => updateEndpoint(endpoint.id, "path", e.target.value)}
                                                    placeholder="https://api.example.com/v1/weather"
                                                    className="bg-zinc-900 border-white/5 h-10 rounded-lg text-sm font-mono"
                                                />
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
                            className="bg-emerald-500 text-white hover:bg-emerald-400 font-bold px-12 h-12 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditAPI;
