import { defineConfig } from "@mikro-orm/postgresql";
import path from "path";
import { Post } from "./Entities/Post";
import { User } from "./Entities/User";

// Config for database
export default defineConfig({
    migrations: {
            path: path.join(__dirname, "./Migrations")
        },
        entities: [Post, User],
        allowGlobalContext: true,
        type: "postgresql",
        dbName: "social-media-site-db",
        user: "abhij",
        debug: true,
});