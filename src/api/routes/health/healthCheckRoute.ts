import type { FastifyInstance } from "fastify";
import { endpointsV1 } from "../utils/endpoints";
import z from "zod";

const healthCheckResponseSchema = z.object({
    status: z.string(),
});

type Response = z.infer<typeof healthCheckResponseSchema>;

export function healthCheckRoute(server: FastifyInstance): Promise<void> {
    server.get<{ Reply: Response }>(endpointsV1.healthCheck, (_, reply) => {
        reply.code(200).send({ status: "healthy" });
    });

    return Promise.resolve();
}
