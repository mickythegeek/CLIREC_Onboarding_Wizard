import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { ClientInfoStep } from "./ClientInfoStep";
import { AccountsConfigStep } from "./AccountsConfigStep";
import { ReviewStep } from "./ReviewStep";
import { WizardData, Account, ClientInfo } from "@/types/wizard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { requirementsApi, adminApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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

interface SubmitButtonProps {
    wizardData: WizardData;
    editId?: number;
    isAdminEdit?: boolean;
}

function SubmitButton({ wizardData, editId, isAdminEdit }: SubmitButtonProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const isEditMode = editId !== undefined;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                clientName: wizardData.clientInfo.clientName,
                clientId: wizardData.clientInfo.clientId,
                region: wizardData.clientInfo.region,
                responseJson: JSON.stringify(wizardData),
                status: "Submitted",
            };

            if (isEditMode) {
                // Use admin API if admin is editing
                if (isAdminEdit) {
                    await adminApi.updateRequirement(editId, payload);
                } else {
                    await requirementsApi.updateRequirement(editId, payload);
                }
                toast({
                    title: "Changes Saved!",
                    description: "Your configuration has been updated successfully.",
                });
            } else {
                await requirementsApi.createRequirement(payload);
                toast({
                    title: "Configuration Complete!",
                    description: "Your reconciliation setup has been submitted successfully.",
                });
            }
            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: isEditMode ? "Update Failed" : "Submission Failed",
                description: error.response?.data?.message || "Failed to submit. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Saving..." : "Submitting..."}
                </>
            ) : (
                <>
                    {isEditMode ? (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Finish Setup
                        </>
                    )}
                </>
            )}
        </Button>
    );
}

interface OnboardingWizardProps {
    editId?: number;
}

export function OnboardingWizard({ editId }: OnboardingWizardProps) {
    const { isAdmin, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [wizardData, setWizardData] = useState<WizardData>({
        clientInfo: initialClientInfo,
        accounts: [createEmptyAccount()],
    });

    const isEditMode = editId !== undefined;
    // For edit mode, admin uses admin API to bypass ownership/lock checks
    const isAdminEdit = isEditMode && isAdmin;

    // Load existing data when editing
    useEffect(() => {
        // Wait for auth to be ready before fetching
        if (authLoading) return;

        if (editId) {
            setIsLoading(true);
            // Use admin API if admin is editing
            const fetchPromise = isAdmin
                ? adminApi.getRequirement(editId)
                : requirementsApi.getRequirement(editId);

            fetchPromise.then((response) => {
                const data = response.data;
                // Parse the responseJson to get the full wizard data
                if (data.responseJson) {
                    try {
                        const parsedData = JSON.parse(data.responseJson);
                        setWizardData(parsedData);
                    } catch {
                        // Fallback: construct from fields
                        setWizardData({
                            clientInfo: {
                                clientName: data.clientName || "",
                                clientId: data.clientId || "",
                                region: data.region || "",
                            },
                            accounts: [createEmptyAccount()],
                        });
                    }
                }
            })
                .catch((error) => {
                    toast({
                        title: "Failed to Load",
                        description: error.response?.data?.message || "Could not load requirement data.",
                        variant: "destructive",
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [editId, isAdmin, authLoading]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading requirement...</p>
                </div>
            </div>
        );
    }

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
                    <div className="flex items-center justify-between">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                        <div className="h-10 w-auto">
                            <img src="/CLIREC_Logo.png" alt="CLIREC Logo" className="h-full w-auto object-contain" />
                        </div>
                        <div className="w-24" /> {/* Spacer for balance */}
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
                            {isEditMode ? "Edit Requirement" : "Accounts Requirements Gathering"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditMode
                                ? "Modify your existing configuration"
                                : "Configure your bank reconciliation setup in a few simple steps"}
                        </p>
                    </motion.div>

                    <div className="flex justify-center">
                        <div className="max-w-2xl w-full">
                            <StepIndicator steps={steps} currentStep={currentStep} />
                        </div>
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
                            <SubmitButton wizardData={wizardData} editId={editId} isAdminEdit={isAdminEdit} />
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
