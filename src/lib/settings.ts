import { prisma } from "./db";
import { settingDefaults, type SettingKey } from "@/content/site";

export type SiteSettings = Record<SettingKey, string>;

/**
 * Reads every setting in one query and layers it over the defaults,
 * so callers always get a complete object.
 */
export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const resolved = { ...settingDefaults } as SiteSettings;
  for (const row of rows) {
    if (row.key in resolved) {
      resolved[row.key as SettingKey] = row.value;
    }
  }
  return resolved;
}

export async function saveSettings(values: Partial<SiteSettings>) {
  const entries = Object.entries(values).filter(([key]) => key in settingDefaults);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: value ?? "" },
        create: { key, value: value ?? "" },
      }),
    ),
  );
}

/** Only treat the store as configured when there is a usable http(s) URL. */
export function storeIsConfigured(settings: SiteSettings) {
  return /^https?:\/\/.+/i.test(settings.storeUrl.trim());
}
