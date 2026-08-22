import SettingsView from "../../components/SettingsView";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { topbarUser } = useAuth();
  return (
    <SettingsView
      topbarProps={{
        eyebrow: "Applicant", user: topbarUser || { name: "User", role: "Applicant", initials: "?", color: "var(--veld)" },
      }}
    />
  );
}
