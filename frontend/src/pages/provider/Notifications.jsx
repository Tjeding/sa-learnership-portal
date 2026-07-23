import NotificationsView from "../../components/NotificationsView";

export default function Notifications() {
  return (
    <NotificationsView
      topbarProps={{
        eyebrow: "Provider", notifCount: 3, msgCount: 4,
        user: { name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" },
      }}
    />
  );
}
