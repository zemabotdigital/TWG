import { settingDefaults, type SettingKey } from "@/content/site";

export type SiteSettings = Record<SettingKey, string>;

/**
 * Site settings.
 *
 * These were editable from the admin dashboard and stored in the database.
 * The site is now frontend-only, so the values in src/content/site.ts are the
 * single source of truth. Edit them there and redeploy.
 */
export async function getSettings(): Promise<SiteSettings> {
  return { ...settingDefaults } as SiteSettings;
}

/** Only treat the store as configured when there is a usable http(s) URL. */
export function storeIsConfigured(settings: SiteSettings) {
  return /^https?:\/\/.+/i.test(settings.storeUrl.trim());
}
