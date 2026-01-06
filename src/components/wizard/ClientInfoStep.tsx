import { Input } from "@/components/ui/input";
import { FormField, FormLabel, FormSection } from "@/components/ui/form-elements";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Building2, Hash, Globe } from "lucide-react";

interface ClientInfo {
    clientName: string;
    clientId: string;
    region: string;
}

interface ClientInfoStepProps {
    data: ClientInfo;
    onChange: (data: ClientInfo) => void;
}

const regions = [
    { value: "emea", label: "EMEA (Europe, Middle East, Africa)" },
    { value: "apac", label: "APAC (Asia Pacific)" },
    { value: "americas", label: "Americas" },
];

export function ClientInfoStep({ data, onChange }: ClientInfoStepProps) {
    const updateField = (field: keyof ClientInfo, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <FormSection
                title="Client Information"
                description="Enter the basic details about your accounts for reconciliation setup."
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    <FormField className="sm:col-span-2">
                        <FormLabel required>Client Name</FormLabel>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                value={data.clientName}
                                onChange={(e) => updateField("clientName", e.target.value)}
                                placeholder="Enter client name"
                                className="pl-11"
                            />
                        </div>
                    </FormField>

                    <FormField>
                        <FormLabel required>Client ID / Code</FormLabel>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                value={data.clientId}
                                onChange={(e) => updateField("clientId", e.target.value)}
                                placeholder="e.g., CLT-001"
                                className="pl-11"
                            />
                        </div>
                    </FormField>

                    <FormField>
                        <FormLabel required>Region</FormLabel>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                            <Select
                                value={data.region}
                                onValueChange={(value) => updateField("region", value)}
                            >
                                <SelectTrigger className="pl-11 h-11 bg-secondary/50 border-border hover:border-muted-foreground/50">
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((region) => (
                                        <SelectItem key={region.value} value={region.value}>
                                            {region.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </FormField>
                </div>
            </FormSection>
        </motion.div>
    );
}
