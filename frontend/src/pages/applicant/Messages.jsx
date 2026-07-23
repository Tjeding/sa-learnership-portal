import MessagesView from "../../components/MessagesView";
import { currentApplicant } from "../../data/mockData";

export default function Messages() {
  return (
    <MessagesView
      topbarProps={{
        eyebrow: "Applicant", notifCount: 3, msgCount: 2,
        user: { name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" },
      }}
    />
  );
}
