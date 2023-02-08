import { MikroORM } from "@mikro-orm/postgresql";
import express from "express";
import { buildSchema } from "type-graphql/dist/utils";
import { ApolloServer } from 'apollo-server-express';
import mikroOrmConfig from "./mikro-orm.config";
import { PostResolver } from "./Resolvers/post";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();
    const app = express();
    app.listen(4000, () => {
        console.log("Listening to requests on port 4000");
    });
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver]
        }),
        context: () => ({ em: orm.em })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}

main();