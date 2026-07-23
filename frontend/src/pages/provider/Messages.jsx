import MessagesView from "../../components/MessagesView";

export default function Messages() {
  return (
    <MessagesView
      topbarProps={{
        eyebrow: "Provider", notifCount: 3, msgCount: 4,
        user: { name: "Thabo Ndlovu", role: "Tech Solutions SA", initials: "TN", color: "var(--sun-deep)" },
      }}
    />
  );
}
