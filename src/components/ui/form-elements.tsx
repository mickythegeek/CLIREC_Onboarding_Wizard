import { cn } from "@/lib/utils";

interface FormLabelProps {
    children: React.ReactNode;
    required?: boolean;
    className?: string;
}

export function FormLabel({ children, required, className }: FormLabelProps) {
    return (
        <label className={cn("text-sm font-medium text-foreground mb-2 block", className)}>
            {children}
            {required && <span className="text-primary ml-1">*</span>}
        </label>
    );
}

interface FormFieldProps {
    children: React.ReactNode;
    className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
    return <div className={cn("space-y-2", className)}>{children}</div>;
}

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
    return (
        <div className={cn("space-y-6", className)}>
            <div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
