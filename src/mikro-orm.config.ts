import { defineConfig } from "@mikro-orm/postgresql";
import path from "path";
import { Posts } from "./Entities/post";

// Config for database
export default defineConfig({
    migrations: {
            path: path.join(__dirname, "./Migrations")
        },
        entities: [Posts],
        allowGlobalContext: true,
        type: "postgresql",
        dbName: "social-media-site-db",
        user: "abhij",
        debug: true,
});