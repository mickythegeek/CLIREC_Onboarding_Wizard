import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField, FormLabel } from "@/components/ui/form-elements";
import { Account, FileRule } from "@/types/wizard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AccountBlockProps {
    account: Account;
    index: number;
    onUpdate: (account: Account) => void;
    onRemove: () => void;
    canRemove: boolean;
}

export function AccountBlock({ account, index, onUpdate, onRemove, canRemove }: AccountBlockProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const updateField = <K extends keyof Account>(field: K, value: Account[K]) => {
        onUpdate({ ...account, [field]: value });
    };

    const addFileRule = () => {
        const newRule: FileRule = {
            id: crypto.randomUUID(),
            fileNamePattern: "",
            extractionRules: "",
        };
        updateField("fileRules", [...account.fileRules, newRule]);
    };

    const updateFileRule = (ruleId: string, updates: Partial<FileRule>) => {
        updateField(
            "fileRules",
            account.fileRules.map((rule) =>
                rule.id === ruleId ? { ...rule, ...updates } : rule
            )
        );
    };

    const removeFileRule = (ruleId: string) => {
        updateField(
            "fileRules",
            account.fileRules.filter((rule) => rule.id !== ruleId)
        );
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-border bg-card/50 overflow-hidden"
        >
            {/* Header */}
            <div
                className={cn(
                    "flex items-center justify-between px-5 py-4 cursor-pointer transition-colors",
                    "hover:bg-secondary/30"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div>
                        <h4 className="font-medium text-foreground">
                            {account.accountName || `Account ${index + 1}`}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            {account.fileRules.length} file rule{account.fileRules.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {canRemove && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 space-y-8 border-t border-border pt-5">
                            {/* Section 1: Account Requirements (Spreadsheet) */}
                            <div className="space-y-4">
                                <h5 className="text-sm font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</span>
                                    Account Requirements
                                </h5>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    <FormField>
                                        <FormLabel required>Account Name</FormLabel>
                                        <Input
                                            value={account.accountName}
                                            onChange={(e) => updateField("accountName", e.target.value)}
                                            placeholder="Enter account name"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel required>Account Number</FormLabel>
                                        <Input
                                            value={account.accountNumber}
                                            onChange={(e) => updateField("accountNumber", e.target.value)}
                                            placeholder="e.g., GL-12345"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Currency (CCY)</FormLabel>
                                        <Input
                                            value={account.currency}
                                            onChange={(e) => updateField("currency", e.target.value)}
                                            placeholder="e.g., NGN, USD"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Unit</FormLabel>
                                        <Input
                                            value={account.unit}
                                            onChange={(e) => updateField("unit", e.target.value)}
                                            placeholder="e.g., Settlement"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Account Owner (User)</FormLabel>
                                        <Input
                                            value={account.accountOwner}
                                            onChange={(e) => updateField("accountOwner", e.target.value)}
                                            placeholder="e.g., John Doe"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Representative Account</FormLabel>
                                        <Input
                                            value={account.representativeAccount}
                                            onChange={(e) => updateField("representativeAccount", e.target.value)}
                                            placeholder="Rep. Account"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Self Reconciling?</FormLabel>
                                        <Select
                                            value={account.isSelfReconciling}
                                            onValueChange={(val) => updateField("isSelfReconciling", val)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Is Active?</FormLabel>
                                        <Select
                                            value={account.isActive}
                                            onValueChange={(val) => updateField("isActive", val)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    {account.isActive === "Yes" && (
                                        <FormField>
                                            <FormLabel>Last Recon Date</FormLabel>
                                            <Input
                                                type="date"
                                                value={account.lastReconDate}
                                                onChange={(e) => updateField("lastReconDate", e.target.value)}
                                            />
                                        </FormField>
                                    )}

                                    <FormField>
                                        <FormLabel>Recon Frequency</FormLabel>
                                        <Select
                                            value={account.reconFrequency}
                                            onValueChange={(val) => updateField("reconFrequency", val)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Daily">Daily</SelectItem>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Internal Source</FormLabel>
                                        <Input
                                            value={account.internalSource}
                                            onChange={(e) => updateField("internalSource", e.target.value)}
                                            placeholder="e.g., Finacle"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>External Account Number</FormLabel>
                                        <Input
                                            value={account.externalAccountNumber}
                                            onChange={(e) => updateField("externalAccountNumber", e.target.value)}
                                            placeholder="Ext. Acc No."
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Settlement Files Count</FormLabel>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={account.settlementFilesCount}
                                            onChange={(e) => updateField("settlementFilesCount", parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>File Format</FormLabel>
                                        <Input
                                            value={account.fileFormat}
                                            onChange={(e) => updateField("fileFormat", e.target.value)}
                                            placeholder="e.g., CSV, XLSX"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Section 2: Matching Requirements */}
                            <div className="space-y-4 pt-4 border-t border-dashed border-border/50">
                                <h5 className="text-sm font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">2</span>
                                    Matching Requirements
                                </h5>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField>
                                        <FormLabel>Has Matching Criteria?</FormLabel>
                                        <Select
                                            value={account.hasMatchingCriteria}
                                            onValueChange={(val) => updateField("hasMatchingCriteria", val)}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>

                                    <FormField className="sm:col-span-2">
                                        <FormLabel>Internal Reference Logic</FormLabel>
                                        <Textarea
                                            value={account.internalRefLogic}
                                            onChange={(e) => updateField("internalRefLogic", e.target.value)}
                                            placeholder="Unique references to identify matching transactions on Internal datasource..."
                                            rows={2}
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Sample Internal Ref</FormLabel>
                                        <Input
                                            value={account.sampleInternalRef}
                                            onChange={(e) => updateField("sampleInternalRef", e.target.value)}
                                            placeholder="e.g., REF123456"
                                        />
                                    </FormField>

                                    <FormField className="sm:col-span-2">
                                        <FormLabel>External Reference Logic</FormLabel>
                                        <Textarea
                                            value={account.externalRefLogic}
                                            onChange={(e) => updateField("externalRefLogic", e.target.value)}
                                            placeholder="Unique references to identify matching transactions on external files..."
                                            rows={2}
                                        />
                                    </FormField>

                                    <FormField>
                                        <FormLabel>Sample External Ref</FormLabel>
                                        <Input
                                            value={account.sampleExternalRef}
                                            onChange={(e) => updateField("sampleExternalRef", e.target.value)}
                                            placeholder="e.g., EXT123456"
                                        />
                                    </FormField>

                                    <FormField className="sm:col-span-2">
                                        <FormLabel>Additional Info</FormLabel>
                                        <Textarea
                                            value={account.additionalInfo}
                                            onChange={(e) => updateField("additionalInfo", e.target.value)}
                                            placeholder="Any additional reconciliation info..."
                                            rows={2}
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Section 3: Filtering Conditions (Text File) */}
                            <div className="space-y-4 pt-4 border-t border-dashed border-border/50">
                                <h5 className="text-sm font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">3</span>
                                    Filtering Conditions (Technical)
                                </h5>

                                <FormField>
                                    <FormLabel>Product Count</FormLabel>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="max-w-[150px]"
                                        value={account.productCount}
                                        onChange={(e) => updateField("productCount", parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                </FormField>

                                {/* File Rules */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            Settlement Files & Rules
                                        </h5>
                                        <Button variant="outline" size="sm" onClick={addFileRule}>
                                            <Plus className="w-4 h-4" />
                                            Add File Rule
                                        </Button>
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {account.fileRules.map((rule, ruleIndex) => (
                                            <motion.div
                                                key={rule.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        Rule {ruleIndex + 1}
                                                    </span>
                                                    {account.fileRules.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                            onClick={() => removeFileRule(rule.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <FormField>
                                                        <FormLabel>File Name Pattern</FormLabel>
                                                        <Input
                                                            value={rule.fileNamePattern}
                                                            onChange={(e) =>
                                                                updateFileRule(rule.id, { fileNamePattern: e.target.value })
                                                            }
                                                            placeholder="e.g., *_settlement_*.csv"
                                                        />
                                                    </FormField>

                                                    <FormField>
                                                        <FormLabel>Extraction Rules</FormLabel>
                                                        <Input
                                                            value={rule.extractionRules}
                                                            onChange={(e) =>
                                                                updateFileRule(rule.id, { extractionRules: e.target.value })
                                                            }
                                                            placeholder="Define extraction rules"
                                                        />
                                                    </FormField>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Matching Logic */}
                                <FormField>
                                    <FormLabel>Detailed Matching Logic (Filtering Doc)</FormLabel>
                                    <Textarea
                                        value={account.matchingLogic}
                                        onChange={(e) => updateField("matchingLogic", e.target.value)}
                                        placeholder="Describe the detailed reconciliation matching logic from the filtering conditions doc..."
                                        rows={4}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
