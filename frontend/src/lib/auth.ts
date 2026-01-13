import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    // Explicitly disabling hooks that might interfere if not configured
    databaseHooks: {
    },
    plugins: [
        jwt({
            issuer: "todo-app",
            expiresIn: "7d",
            secret: process.env.BETTER_AUTH_SECRET!,
        }),
    ],
});
