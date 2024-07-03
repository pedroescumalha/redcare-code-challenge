import { GithubClient } from "../../clients";
import { getEnv } from "../env/environmentVariablesService";

export type ScoreRepositoriesResponse = {
    score: number;
    name: string;
    id: number;
    url: string;
    createdAt: Date;
    language: string;
};

type ScoreRepositoriesInput = {
    createdAt: Date;
    language: string;
    take?: number;
    page?: number;
}

export async function getRepositoriesScore(input: ScoreRepositoriesInput)
: Promise<ScoreRepositoriesResponse[]> {
    const apiToken = getEnv("GITHUB_API_TOKEN");
    const client = new GithubClient(apiToken);

    const repos = await client.searchPublicRepositories({
        per_page: input.take,
        page: input.page,
        query: [
            `created:>=${input.createdAt.toISOString()}`,
            `language:${input.language}`,
        ],
    });

    return repos.items.map((r) => {
        return {
            score: r.score,
            id: r.id,
            url: r.url,
            name: r.name,
            createdAt: new Date(r.created_at),
            language: r.language ?? "",
        };
    });
}
