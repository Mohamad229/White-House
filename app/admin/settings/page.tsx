import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getStoreSettings } from "@/lib/data";

export default async function Page() {
  await requireAdmin();
  const settings = await getStoreSettings();
  return (
    <AdminShell>
      <AdminHeader title="الإعدادات" />
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
