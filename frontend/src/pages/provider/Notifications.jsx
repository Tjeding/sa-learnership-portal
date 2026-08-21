import NotificationsView from "../../components/NotificationsView";
import { useAuth } from "../../context/AuthContext";

export default function Notifications() {
  const { topbarUser } = useAuth();
  return (
    <NotificationsView
      topbarProps={{
        eyebrow: "Provider",
        msgCount: 4,
        user: topbarUser || { name: "Provider", role: "Provider", initials: "?", color: "var(--sun-deep)" },
      }}
    />
  );
}