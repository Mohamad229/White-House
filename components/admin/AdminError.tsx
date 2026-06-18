export function AdminError({ message }: { message?: string }) {
  return (
    <section className="premium-card border-red-200 bg-red-50 p-5 text-red-900">
      <h2 className="text-xl font-black">Database connection required</h2>
      <p className="mt-2 text-sm font-bold leading-6">
        {message ||
          "Admin data could not be loaded. Check DATABASE_URL, run migrations, and make sure MySQL is reachable."}
      </p>
    </section>
  );
}
