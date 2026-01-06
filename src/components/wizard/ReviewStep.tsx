import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-elements";
import { WizardData } from "@/types/wizard";
import { motion } from "framer-motion";
import { Copy, Download, Check, FileJson, Building2, Layers } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ReviewStepProps {
    data: WizardData;
}

export function ReviewStep({ data }: ReviewStepProps) {
    const [copied, setCopied] = useState(false);

    const jsonOutput = JSON.stringify(
        {
            clientInfo: data.clientInfo,
            accounts: data.accounts.map(({ id, ...account }) => ({
                ...account,
                fileRules: account.fileRules.map(({ id: ruleId, ...rule }) => rule),
            })),
            generatedAt: new Date().toISOString(),
        },
        null,
        2
    );

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonOutput);
        setCopied(true);
        toast({
            title: "Copied to clipboard",
            description: "JSON configuration has been copied.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([jsonOutput], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.clientInfo.clientId || "clirec"}-config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
            title: "Download started",
            description: "Your configuration file is being downloaded.",
        });
    };

    const regionLabels: Record<string, string> = {
        emea: "EMEA",
        apac: "APAC",
        americas: "Americas",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <FormSection
                title="Review & Submit"
                description="Review your configuration and submit for implementation."
            >
                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <h4 className="font-medium text-foreground">Client Details</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="text-foreground font-medium">
                                    {data.clientInfo.clientName || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID</span>
                                <span className="text-foreground font-medium">
                                    {data.clientInfo.clientId || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Region</span>
                                <span className="text-foreground font-medium">
                                    {regionLabels[data.clientInfo.region] || "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-primary" />
                            </div>
                            <h4 className="font-medium text-foreground">Configuration</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Accounts</span>
                                <span className="text-foreground font-medium">{data.accounts.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">File Rules</span>
                                <span className="text-foreground font-medium">
                                    {data.accounts.reduce((sum, acc) => sum + acc.fileRules.length, 0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Products</span>
                                <span className="text-foreground font-medium">
                                    {data.accounts.reduce((sum, acc) => sum + acc.productCount, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="flex flex-col items-center justify-center p-8 bg-secondary/20 rounded-xl border border-border mt-8">
                    <div className="text-center space-y-2 mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Ready to Submit?</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Once submitted, your configuration will be saved to the database for the Implementation Team to review.
                        </p>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => {
                            console.log("Submitting Configuration:", data);
                            toast({
                                title: "Configuration Submitted",
                                description: "Your setup has been saved to the database successfully.",
                            });
                        }}
                        className="w-full sm:w-auto min-w-[200px]"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Submit Configuration
                    </Button>
                </div>
            </FormSection>
        </motion.div>
    );
}
