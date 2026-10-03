import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { User } from 'oidc-client-ts';
import * as z from 'zod';

const pyroJwtPayloadSchema = z.object({
  preferred_username: z.string().optional(),
  realm_access: z.object({ roles: z.array(z.string()).optional() }).optional(),
});

export type PyroJwtPayload = JwtPayload & z.infer<typeof pyroJwtPayloadSchema>;

export type Role = 'F001_LIVESTREAMING' | 'F002_OCCLUSION_MASK';

const extractAccessToken = (user?: User | null) => {
  if (!user) {
    return null;
  }

  try {
    const result = pyroJwtPayloadSchema.safeParse(
      jwtDecode<unknown>(user.access_token)
    );
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const extractRoles = (user?: User | null): string[] =>
  extractAccessToken(user)?.realm_access?.roles ?? [];

export const extractUsername = (user?: User | null): string | null =>
  extractAccessToken(user)?.preferred_username ?? null;
