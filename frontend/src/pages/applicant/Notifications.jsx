import NotificationsView from "../../components/NotificationsView";
import { currentApplicant } from "../../data/mockData";

export default function Notifications() {
  return (
    <NotificationsView
      topbarProps={{
        eyebrow: "Applicant",
        msgCount: 2,
        user: {
          name: currentApplicant.name,
          role: "Applicant",
          initials: currentApplicant.initials,
          color: "var(--veld)",
        },
      }}
    />
  );
}