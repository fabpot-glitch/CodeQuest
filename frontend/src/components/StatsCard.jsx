export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
