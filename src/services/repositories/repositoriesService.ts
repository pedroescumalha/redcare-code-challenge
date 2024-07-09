import { GithubClient } from "../../clients";
import { logger } from "../../common";
import { getEnv } from "../env/environmentVariablesService";
import { calculatePopularityScore } from "./calculatePopularityScore";

export type ScoreRepositoriesResponse = {
    score: number;
    name: string;
    id: number;
    url: string;
    createdAt: Date;
    language: string;
    starsCount: number;
    forksCount: number;
};

type ScoreRepositoriesInput = {
    createdAt?: Date;
    language?: string;
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
                updatedAt: new Date(r.updated_at),
                maxForks,
                maxStars,
            }),
            id: r.id,
            url: r.url,
            name: r.name,
            createdAt: new Date(r.created_at),
            language: r.language ?? "",
            starsCount: r.stargazers_count,
            forksCount: r.forks_count,
        };
    });
}

async function getRepos(client: GithubClient, input: ScoreRepositoriesInput)
: Promise<ReturnType<typeof client.searchPublicRepositories>> {
    const createdAt = (input.createdAt ?? new Date("1970-01-01")).toISOString();

    const repos = await client.searchPublicRepositories({
        per_page: input.take,
        page: input.page,
        query: [ `created:>=${createdAt}`, `language:${input.language}` ],
    });

    logger.getLogger().info(`${repos.total_count} repositories found.
        - Language: ${input.language};
        - createdAt: ${createdAt}`);

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
