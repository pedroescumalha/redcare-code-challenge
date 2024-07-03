import { GithubClient } from "../../clients";
import { logger, utils } from "../../common";
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

    const [repos, maxStars, maxForks] = await Promise.all([
        getRepos(client, input),
        getMaxStars(client),
        getMaxForks(client),
    ]);

    return repos.items.map((r) => {
        return {
            score: calculatePopularityScore({
                forks: r.forks_count,
                stars: r.stargazers_count,
                maxForks,
                maxStars,
            }),
            id: r.id,
            url: r.url,
            name: r.name,
            createdAt: new Date(r.created_at),
            language: r.language ?? "",
        };
    });
}

async function getRepos(client: GithubClient, input: ScoreRepositoriesInput)
: Promise<ReturnType<typeof client.searchPublicRepositories>> {
    const repos = await client.searchPublicRepositories({
        per_page: input.take,
        page: input.page,
        query: [ `created:>=${input.createdAt.toISOString()}`, `language:${input.language}` ],
        sort: "stars",
        order: "desc",
    });

    logger.getLogger().info(`${repos.total_count} repositories found.
        - Language: ${input.language};
        - createdAt: ${input.createdAt.toISOString()}`);

    return repos;
}

async function getMaxStars(client: GithubClient): Promise<number> {
    const repos = await client.searchPublicRepositories({
        per_page: 1,
        query: [],
        sort: "stars",
        order: "desc",
    });

    const maxStars = repos.items[0]?.stargazers_count ?? 0;

    logger.getLogger().info(`Max stars found: ${maxStars}`);

    return maxStars;
}

async function getMaxForks(client: GithubClient): Promise<number> {
    const repos = await client.searchPublicRepositories({
        per_page: 1,
        sort: "fork",
        order: "desc",
        query: [],
    });

    const maxForks = repos.items[0]?.forks_count ?? 0;
    logger.getLogger().info(`Max forks found: ${maxForks}`);

    return maxForks;
}

function calculatePopularityScore(input: {
    stars: number;
    forks: number;
    maxStars: number;
    maxForks: number;
}): number {
    const starsScore = input.stars / input.maxStars;
    const forksScore = input.forks / input.maxForks;

    return utils.round((starsScore * 0.5) + (forksScore * 0.5));
}
