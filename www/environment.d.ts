declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // NODE_ENV: "development" | "production";
      NEXT_PUBLIC_APP_ENV: "development" | "production";

      NEXT_PUBLIC_API_BASE_URL: string;
      NEXT_PUBLIC_API_TIMEOUT: string;

      NEXT_PUBLIC_WEBSITE_URL: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;

      NEXT_PUBLIC_JWT_SECRET: string;
    }
  }
}

export {};
