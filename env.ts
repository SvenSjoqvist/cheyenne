import { z } from "zod";

const envSchema = z.object({
  COMPANY_NAME: z.string(),
  TWITTER_CREATOR: z.string(),
  TWITTER_SITE: z.string(),
  SITE_NAME: z.string(),
  SHOPIFY_REVALIDATION_SECRET: z.string(),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string(),
  SHOPIFY_STORE_DOMAIN: z.string(),
  SHOPIFY_ACCESS_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string(),
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string(),
  NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN: z.string(),
  NEXT_PUBLIC_SHOPIFY_REVALIDATION_SECRET: z.string(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}