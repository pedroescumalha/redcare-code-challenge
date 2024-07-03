import type { FastifyInstance } from "fastify";
import { endpointsV1 } from "../utils/endpoints";
import { repositoriesService } from "../../../services";
import z from "zod";

const queryParamsSchema = z.object({
    createdAt: z.string().date().optional(),
    language: z.string().optional(),
    take: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

type ScoreRepositoriesRouteResponse = {
    items: (Omit<repositoriesService.ScoreRepositoriesResponse, "createdAt"> & {
        createdAt: string;
    })[];
}

export function getRepositoriesScoreRoute(server: FastifyInstance): Promise<void> {
    server.get<{
        Querystring: z.infer<typeof queryParamsSchema>;
        Reply: ScoreRepositoriesRouteResponse;
    }>(
        endpointsV1.getRepositoriesScore,
        {
            schema: {
                params: queryParamsSchema,
            },
        },
        async (req, reply) => {
            const res = await repositoriesService.getRepositoriesScore({
                createdAt: req.query.createdAt ? new Date(req.query.createdAt) : undefined,
                language: req.query.language,
                page: req.query.page,
                take: req.query.take,
            });

            reply.code(200).send({
                items: res.map((r) => {
                    return { ...r, createdAt: r.createdAt.toISOString() };
                }),
            });
        },
    );

    return Promise.resolve(
        server.log.info("get repositories score route registered."),
    );
}
