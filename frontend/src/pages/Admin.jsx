import DashboardLayout from "../layouts/DashboardLayout";

export default function Admin() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <ul className="space-y-3">
        <li>➕ Add Problem</li>
        <li>✏️ Edit Problem</li>
        <li>🗑 Delete Problem</li>
        <li>👥 Manage Users</li>
      </ul>
    </DashboardLayout>
  );
}
