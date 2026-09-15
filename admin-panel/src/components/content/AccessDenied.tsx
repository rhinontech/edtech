import { Lock } from "lucide-react";
import { EmptyState, Page } from "@/components/Page";

export function AccessDenied({ section }: { section: string }) {
  return (
    <Page title={section}>
      <EmptyState
        icon={<Lock />}
        title={`You don't have access to ${section}`}
        description="Ask a super admin to add this section to your role on the Roles screen."
      />
    </Page>
  );
}

export default AccessDenied;
