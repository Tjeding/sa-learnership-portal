import MessagesView from "../../components/MessagesView";
import { currentApplicant } from "../../data/mockData";

export default function Messages() {
  return (
    <MessagesView
      topbarProps={{
        eyebrow: "Applicant", notifCount: 0, msgCount: 0,
        notifTo: "/applicant/notifications", msgTo: "/applicant/messages",
        user: { name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" },
      }}
    />
  );
}
