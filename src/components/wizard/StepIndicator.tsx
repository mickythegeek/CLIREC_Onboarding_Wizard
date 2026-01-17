import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Step {
    id: number;
    title: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-center gap-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: currentStep === step.id ? 1.1 : 1,
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300",
                                    currentStep === step.id && "step-active",
                                    currentStep > step.id && "step-completed border-primary",
                                    currentStep < step.id && "step-pending border-border"
                                )}
                            >
                                {currentStep > step.id ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span>{step.id}</span>
                                )}
                            </motion.div>
                            <div className="mt-3 text-center">
                                <p
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="w-16 mx-2 mb-10">
                                <div className="h-0.5 bg-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: currentStep > step.id ? "100%" : "0%",
                                        }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
