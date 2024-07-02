import type { FastifyInstance } from "fastify";
import { GithubClient } from "../../../clients";
import { endpointsV1 } from "../utils/endpoints";

export function getRepositoriesScoreRoute(server: FastifyInstance): Promise<void> {
    server.get(endpointsV1.getRepositoriesScore, async (_, reply) => {
        // eslint-disable-next-line max-len
        const githubClient = new GithubClient("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");

        await githubClient.searchPublicRepositories({
            query: [ "created:>=2024-07-02", "language:javascript" ],
        });

        reply.code(200).send({ status: "pong" });
    });

    return Promise.resolve();
}
