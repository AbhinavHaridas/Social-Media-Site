import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { SqlEntityManager } from "@mikro-orm/knex";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Request, Response } from 'express';

export type ContextType = {
    em: SqlEntityManager<PostgreSqlDriver> & EntityManager<IDatabaseDriver<Connection>>,
    req: Request & { session: { userId: number }},
    res: Response 
};