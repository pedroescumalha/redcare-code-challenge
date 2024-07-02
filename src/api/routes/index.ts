import type { FastifyInstance } from "fastify";

export function testRoute(server: FastifyInstance): Promise<void> {
    server.get("/ping", (_, reply) => {
        reply.code(200).send({ status: "pong" });
    });

    return Promise.resolve();
}

export const routes = [
    testRoute,
];
