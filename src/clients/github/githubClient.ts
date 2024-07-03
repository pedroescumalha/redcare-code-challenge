import type z from "zod";
import { searchRepositoriesResponseSchema } from "./schemas";
import assert from "assert";
import { HttpError, ValidationError } from "../../common";
import { request } from "../baseHttpClient";

const QueryParams = {
    PER_PAGE: "per_page",
    PAGE: "page",
    SORT: "sort",
    ORDER: "order",
    QUERY: "q",
};


type PossibleParams = ">=" | "<=" | ">" | "<";
type CreatedAtSearchQuery = `created:${PossibleParams}${string}`;
type LanguageSearchQuery = `language:${string}`;
type SearchQuery = (CreatedAtSearchQuery | LanguageSearchQuery)[];

export class GithubClient {
    private readonly apiEnpoint = new URL("https://api.github.com");
    private readonly apiToken: string;

    constructor(apiToken: string) {
        assert(apiToken, new ValidationError("Invalid api token"));
        this.apiToken = apiToken;
    }

    public async searchPublicRepositories(input: {
        query: SearchQuery;
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

        addQueryParam(url.searchParams, QueryParams.PER_PAGE, (input.per_page ?? 30).toString());
        addQueryParam(url.searchParams, QueryParams.PAGE, (input.page ?? 1).toString());
        addQueryParam(url.searchParams, QueryParams.SORT, input.sort);
        addQueryParam(url.searchParams, QueryParams.ORDER, input.order);
        addQueryParam(url.searchParams, QueryParams.QUERY, buildQuery(input.query));

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
