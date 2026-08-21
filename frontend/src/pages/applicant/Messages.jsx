import MessagesView from "../../components/MessagesView";
import { useAuth } from "../../context/AuthContext";

export default function Messages() {
  const { topbarUser } = useAuth();
  return (
    <MessagesView
      topbarProps={{
        eyebrow: "Applicant", notifCount: 0, msgCount: 0,
        notifTo: "/applicant/notifications", msgTo: "/applicant/messages",
        user: topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" },
      }}
    />
  );
}
