import SettingsView from "../../components/SettingsView";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { topbarUser } = useAuth();
  return (
    <SettingsView
      topbarProps={{
        eyebrow: "Applicant", notifCount: 3, msgCount: 2,
        user: topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" },
      }}
    />
  );
}
