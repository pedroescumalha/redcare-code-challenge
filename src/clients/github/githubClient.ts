import type z from "zod";
import { searchRepositoriesResponseSchema } from "./schemas";
import assert from "assert";
import { HttpError, ValidationError } from "../../common";
import { request } from "../baseHttpClient";

export class GithubClient {
    private readonly apiEnpoint = new URL("https://api.github.com");
    private readonly apiToken: string;

    constructor(apiToken: string) {
        assert(apiToken, new ValidationError("Invalid api token"));
        this.apiToken = apiToken;
    }

    public async searchPublicRepositories(input: {
        query: `${"created:>=" | "language:"}${string}`[];
        sort?: "stars" | "fork";
        order?: "desc" | "asc";
        page?: number;
        per_page?: number;
    }): Promise<z.infer<typeof searchRepositoriesResponseSchema>> {
        if (input.page !== undefined) {
            assert(input.page > 0, new ValidationError("Invalid page"));
        }

        if (input.per_page !== undefined) {
            assert(
                input.per_page > 0 && input.per_page <= 100,
                new ValidationError("Invalid per_page"),
            );
        }

        const url = new URL("/search/repositories", this.apiEnpoint);

        addQueryParam(url.searchParams, "per_page", (input.per_page ?? 30).toString());
        addQueryParam(url.searchParams, "page", (input.page ?? 1).toString());
        addQueryParam(url.searchParams, "sort", input.sort);
        addQueryParam(url.searchParams, "order", input.order);
        addQueryParam(url.searchParams, "q", buildQuery(input.query));

        const res = await request(url, {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        assert(res.ok, new HttpError({ status: res.status, endpoint: res.url, method: "GET" }));

        const result = searchRepositoriesResponseSchema.safeParse(await res.json());

        assert(result.success, new ValidationError("Could not parse search repositories response"));

        return result.data;
    }
}

function addQueryParam(
    searchParams: URLSearchParams,
    key: string,
    value: string | undefined,
): void {
    if (value !== undefined) {
        searchParams.set(key, value);
    }
}

function buildQuery(query: string[]): string {
    return `is:public ${query.join(" ")}`;
}
