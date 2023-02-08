"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const path_1 = __importDefault(require("path"));
const post_1 = require("./Entities/post");
// Config for database
exports.default = (0, postgresql_1.defineConfig)({
    migrations: {
        path: path_1.default.join(__dirname, "./Migrations")
    },
    entities: [post_1.Posts],
    allowGlobalContext: true,
    type: "postgresql",
    dbName: "social-media-site-db",
    user: "abhij",
    debug: true,
});
