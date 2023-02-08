import { MikroORM } from "@mikro-orm/postgresql";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql/dist/utils";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();
    const app = express();
    app.listen(4000, () => {
        console.log("Listening to requests on port 4000");
    })
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            
        })
    })
}

main();