import { MikroORM } from "@mikro-orm/postgresql";
import express from "express";
import { buildSchema } from "type-graphql/dist/utils";
import {
    ApolloServerPluginLandingPageProductionDefault,
    ApolloServerPluginLandingPageLocalDefault
} from '@apollo/server/plugin/landingPage/default';
import * as redis from 'redis';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import mikroOrmConfig from "./mikro-orm.config";
import { PostResolver } from "./Resolvers/post";
import { UserResolver } from "./Resolvers/user";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    // setting up redis
    const redisStore = require('connect-redis')(session);
    const redisClient = redis.createClient({
        legacyMode: true
    });

    redisClient.connect();

    redisClient.on('error', (err) => {
        console.error(err);
    });   const app = express();
     app.use(session({
        name: 'qid',
        store: new redisStore({
            client: redisClient,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax', // csrf
            secure: false 
        },
        saveUninitialized: false,
        secret: 'fkaljfsdkj',
        resave: false
    }));   

    app.listen(4000, () => {
        console.log("Listening to requests on port 4000");
    });

    // Allows to work with localhost instead of their online service
    let plugins: any = [];
    if (process.env.NODE_ENV === "production") {
        plugins = [
            ApolloServerPluginLandingPageProductionDefault({
                embed: true,
                graphRef: "myGraph@prod",
                includeCookies: true,
            }),
        ];
    } else {
        plugins = [
            ApolloServerPluginLandingPageLocalDefault({
                embed: true,
                includeCookies: true, // very important
            }),
        ];
    }

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver]
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
        plugins
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}

main().catch((err) => console.error(err));