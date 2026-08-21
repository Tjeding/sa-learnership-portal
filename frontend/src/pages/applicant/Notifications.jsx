import NotificationsView from "../../components/NotificationsView";
import { useAuth } from "../../context/AuthContext";

export default function Notifications() {
  const { topbarUser } = useAuth();
  return (
    <NotificationsView
      topbarProps={{
        eyebrow: "Applicant",
        msgCount: 2,
        user: topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" },
      }}
    />
  );
}