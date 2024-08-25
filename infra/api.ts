import { table, secret } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
    domain:
        $app.stage === "production"
            ? {
                  name: "api.notes.devonweller.com",
                  dns: false,
                  cert: "arn:aws:acm:us-east-1:568832430140:certificate/a3e4db58-7473-41f8-b2c3-a4cd9acd4b1b",
              }
            : undefined,
    transform: {
        route: {
            handler: {
                link: [table, secret],
            },
            args: {
                auth: { iam: true },
            },
        },
    },
});

api.route("POST /notes", "packages/functions/src/create.main");
api.route("GET /notes/{id}", "packages/functions/src/get.main");
api.route("GET /notes", "packages/functions/src/list.main");
api.route("PUT /notes/{id}", "packages/functions/src/update.main");
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");

api.route("POST /billing", "packages/functions/src/billing.main");
