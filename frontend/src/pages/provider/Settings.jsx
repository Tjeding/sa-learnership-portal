import SettingsView from "../../components/SettingsView";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { topbarUser } = useAuth();
  return (
    <SettingsView
      topbarProps={{
        eyebrow: "Provider", notifCount: 3, msgCount: 4,
        user: topbarUser || { name: "Provider", role: "Provider", initials: "?", color: "var(--sun-deep)" },
      }}
      extraTabs={["Team members"]}
    />
  );
}
