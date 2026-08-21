import MessagesView from "../../components/MessagesView";

export default function Messages() {
  return (
    <MessagesView
      topbarProps={{
        eyebrow: "Provider", notifCount: 0, msgCount: 0,
        notifTo: "/provider/notifications", msgTo: "/provider/messages",
        user: { name: "Provider", role: "Provider", initials: "PR", color: "var(--sun-deep)" },
      }}
    />
  );
}
