import SettingsView from "../../components/SettingsView";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { topbarUser } = useAuth();
  return (
    <SettingsView
      topbarProps={{
        eyebrow: "Provider", user: topbarUser || { name: "Provider", role: "Provider", initials: "?", color: "var(--sun-deep)" },
      }}
      extraTabs={["Team members"]}
    />
  );
}
