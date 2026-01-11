import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { ClientInfoStep } from "./ClientInfoStep";
import { AccountsConfigStep } from "./AccountsConfigStep";
import { ReviewStep } from "./ReviewStep";
import { WizardData, Account, ClientInfo } from "@/types/wizard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const steps = [
    { id: 1, title: "Client Info", description: "Basic details" },
    { id: 2, title: "Accounts", description: "Configure accounts" },
    { id: 3, title: "Review", description: "Submit Config" },
];

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

const initialClientInfo: ClientInfo = {
    clientName: "",
    clientId: "",
    region: "",
};

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [wizardData, setWizardData] = useState<WizardData>({
        clientInfo: initialClientInfo,
        accounts: [createEmptyAccount()],
    });

    const validateStep = (step: number): boolean => {
        if (step === 1) {
            const { clientName, clientId, region } = wizardData.clientInfo;
            if (!clientName.trim() || !clientId.trim() || !region) {
                toast({
                    title: "Missing Information",
                    description: "Please fill in all required fields before proceeding.",
                    variant: "destructive",
                });
                return false;
            }
        }
        if (step === 2) {
            const hasEmptyAccount = wizardData.accounts.some(
                (acc) => !acc.accountName.trim() || !acc.accountNumber.trim()
            );
            if (hasEmptyAccount) {
                toast({
                    title: "Incomplete Accounts",
                    description: "Please fill in the account name and GL number for all accounts.",
                    variant: "destructive",
                });
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleClientInfoChange = (clientInfo: ClientInfo) => {
        setWizardData((prev) => ({ ...prev, clientInfo }));
    };

    const handleAccountsChange = (accounts: Account[]) => {
        setWizardData((prev) => ({ ...prev, accounts }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-border/50 glass">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                        <div className="h-10 w-auto">
                            <img src="/CLIREC_Logo.png" alt="CLIREC Logo" className="h-full w-auto object-contain" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 container max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                            Accounts Requirements Gathering
                        </h1>
                        <p className="text-muted-foreground">
                            Configure your bank reconciliation setup in a few simple steps
                        </p>
                    </motion.div>

                    <div className="max-w-2xl mx-auto">
                        <StepIndicator steps={steps} currentStep={currentStep} />
                    </div>
                </div>

                {/* Wizard Card */}
                <motion.div
                    layout
                    className="glass rounded-2xl border border-border/50 shadow-card overflow-hidden"
                >
                    <div className="p-6 sm:p-8">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <ClientInfoStep
                                    key="step-1"
                                    data={wizardData.clientInfo}
                                    onChange={handleClientInfoChange}
                                />
                            )}
                            {currentStep === 2 && (
                                <AccountsConfigStep
                                    key="step-2"
                                    accounts={wizardData.accounts}
                                    onChange={handleAccountsChange}
                                />
                            )}
                            {currentStep === 3 && (
                                <ReviewStep key="step-3" data={wizardData} />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="px-6 sm:px-8 py-5 border-t border-border/50 bg-secondary/20 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={currentStep === 1 ? "invisible" : ""}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        {currentStep < 3 ? (
                            <Button onClick={handleNext}>
                                Next Step
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    toast({
                                        title: "Configuration Complete!",
                                        description: "Your reconciliation setup has been generated successfully.",
                                    });
                                }}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Finish Setup
                            </Button>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/50 py-4">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        CLIREC Onboarding Wizard — Streamlining Bank Reconciliation
                    </p>
                </div>
            </footer>
        </div>
    );
}
