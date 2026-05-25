function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  DATABASE_URL: requireEnv("NEON_DATABASE_URL"),
  AUTH_SECRET: requireEnv("AUTH_SECRET"),
  NEXTAUTH_URL: requireEnv("NEXTAUTH_URL"),
  CLOUDINARY_CLOUD_NAME: requireEnv("CLD_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLD_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLD_API_SECRET"),
  RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
  ADMIN_EMAIL: requireEnv("ADMIN_EMAIL"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: requireEnv("NEXT_PUBLIC_CLD_CLOUD_NAME"),
} as const;
