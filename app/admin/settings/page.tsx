import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminStoreSettings } from "@/lib/data";

export default async function Page() {
  await requireAdmin();
  let settings;
  try {
    settings = await getAdminStoreSettings();
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª" />
        <AdminError />
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <AdminHeader title="الإعدادات" />
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
