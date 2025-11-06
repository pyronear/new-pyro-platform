import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  language: z.enum(['en', 'es', 'fr']),
  map: z.object({
    baseLayer: z.enum(['osm', 'ign', 'satellite']),
  }),
  audio: z.object({
    alertsEnabled: z.boolean(),
  }),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
