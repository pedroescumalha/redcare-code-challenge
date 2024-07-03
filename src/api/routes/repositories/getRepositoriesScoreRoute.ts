import type { FastifyInstance } from "fastify";
import { endpointsV1 } from "../utils/endpoints";
import { repositoriesService } from "../../../services";

type ScoreRepositoriesRouteResponse = {
    items: (Omit<repositoriesService.ScoreRepositoriesResponse, "createdAt"> & {
        createdAt: string;
    })[];
}

export function getRepositoriesScoreRoute(server: FastifyInstance): Promise<void> {
    server.get<{
        Reply: ScoreRepositoriesRouteResponse;
    }>(endpointsV1.getRepositoriesScore, async (_, reply) => {
        const res = await repositoriesService.getRepositoriesScore({
            createdAt: new Date("2024-07-02"),
            language: "javascript",
        });

        reply.code(200).send({
            items: res.map((r) => {
                return {
                    ...r,
                    createdAt: r.createdAt.toISOString(),
                };
            }),
        });
    });

    return Promise.resolve(
        server.log.info("get repositories score route registered."),
    );
}
