import { useParams } from "react-router-dom";
import { OnboardingWizard } from "@/components/wizard/OnboardingWizard";

export default function EditRequirement() {
    const { id } = useParams<{ id: string }>();
    const editId = id ? parseInt(id, 10) : undefined;

    return <OnboardingWizard editId={editId} />;
}
