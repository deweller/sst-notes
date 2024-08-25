import { api } from "./api";
import { bucket } from "./storage";
import { userPool, identityPool, userPoolClient } from "./auth";

const region = aws.getRegionOutput().name;

export const frontend = new sst.aws.StaticSite("Frontend", {
    path: "packages/frontend",
    build: {
        output: "dist",
        command: "npm run build",
    },
    domain:
        $app.stage === "production"
            ? {
                  name: "www.notes.devonweller.com",
                  //   redirects: ["notes.devonweller.com"],
                  dns: false,
                  cert: "arn:aws:acm:us-east-1:568832430140:certificate/a3e4db58-7473-41f8-b2c3-a4cd9acd4b1b",
              }
            : undefined,
    environment: {
        VITE_REGION: region,
        VITE_API_URL: api.url,
        VITE_BUCKET: bucket.name,
        VITE_USER_POOL_ID: userPool.id,
        VITE_IDENTITY_POOL_ID: identityPool.id,
        VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    },
});
