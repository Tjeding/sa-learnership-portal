import SettingsView from "../../components/SettingsView";
import { currentApplicant } from "../../data/mockData";

export default function Settings() {
  return (
    <SettingsView
      topbarProps={{
        eyebrow: "Applicant", notifCount: 3, msgCount: 2,
        user: { name: currentApplicant.name, role: "Applicant", initials: currentApplicant.initials, color: "var(--veld)" },
      }}
    />
  );
}
