import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { SqlEntityManager } from "@mikro-orm/knex";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export type ContextType = {
    em: SqlEntityManager<PostgreSqlDriver> & EntityManager<IDatabaseDriver<Connection>>
};