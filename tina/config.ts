import { defineConfig } from "tinacms";
import { GlobalConfigCollection } from "./collections/global-config";
import { PageCollection } from "./collections/page";
import { SeoPageCollection } from "./collections/seo-page";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  telemetry: 'disabled',
  branch,

  // Get this from tina.io
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      PageCollection,
      SeoPageCollection,
      GlobalConfigCollection,
    ],
  },
});
