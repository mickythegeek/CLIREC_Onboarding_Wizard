import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-elements";
import { AccountBlock } from "./AccountBlock";
import { Account } from "@/types/wizard";
import { motion } from "framer-motion";
import { Plus, Layers } from "lucide-react";

interface AccountsConfigStepProps {
    accounts: Account[];
    onChange: (accounts: Account[]) => void;
}

const createEmptyAccount = (): Account => ({
    id: crypto.randomUUID(),
    accountNumber: "",
    accountName: "",
    currency: "",
    unit: "",
    accountOwner: "",
    representativeAccount: "",
    isSelfReconciling: "No",
    isActive: "Yes",
    lastReconDate: "",
    reconFrequency: "Daily",
    internalSource: "",
    externalAccountNumber: "",
    settlementFilesCount: 0,
    fileFormat: "",
    hasMatchingCriteria: "Yes",
    internalRefLogic: "",
    sampleInternalRef: "",
    externalRefLogic: "",
    sampleExternalRef: "",
    additionalInfo: "",
    productCount: 0,
    matchingLogic: "",
    fileRules: [
        {
            id: crypto.randomUUID(),
            fileNamePattern: "",
            extractionRules: "",
        },
    ],
});

export function AccountsConfigStep({ accounts, onChange }: AccountsConfigStepProps) {
    const addAccount = () => {
        onChange([...accounts, createEmptyAccount()]);
    };

    const updateAccount = (id: string, updatedAccount: Account) => {
        onChange(accounts.map((acc) => (acc.id === id ? updatedAccount : acc)));
    };

    const removeAccount = (id: string) => {
        onChange(accounts.filter((acc) => acc.id !== id));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <FormSection
                title="Accounts Configuration"
                description="Configure the accounts and their reconciliation rules."
            >
                <div className="space-y-4">
                    {accounts.map((account, index) => (
                        <AccountBlock
                            key={account.id}
                            account={account}
                            index={index}
                            onUpdate={(updated) => updateAccount(account.id, updated)}
                            onRemove={() => removeAccount(account.id)}
                            canRemove={accounts.length > 1}
                        />
                    ))}

                    <motion.div layout>
                        <Button
                            variant="outline"
                            onClick={addAccount}
                            className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Another Account
                        </Button>
                    </motion.div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {accounts.length} Account{accounts.length !== 1 ? "s" : ""} Configured
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {accounts.reduce((sum, acc) => sum + acc.fileRules.length, 0)} total file rules
                            </p>
                        </div>
                    </div>
                </div>
            </FormSection>
        </motion.div>
    );
}
