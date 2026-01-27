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
    // Allow localhost for development
    origin: process.env.NODE_ENV === 'production'
        ? process.env.BETTER_AUTH_URL
        : 'http://localhost:3000',
    // Explicitly disabling hooks that might interfere if not configured
    databaseHooks: {
    },
    plugins: [],
});
