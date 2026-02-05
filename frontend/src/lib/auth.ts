import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Required for Vercel deployments
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    },
    socialProviders: {}, // Empty social providers config
    // Ensure proper URL format for origin
    origin: () => {
        if (process.env.BETTER_AUTH_URL) {
            // Ensure the URL has the protocol
            const url = process.env.BETTER_AUTH_URL;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return `https://${url}`;
            }
            return url;
        }
        return 'http://localhost:3000';
    },
    // Explicitly disabling hooks that might interfere if not configured
    databaseHooks: {
    },
    plugins: [],
});
