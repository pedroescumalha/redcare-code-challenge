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

        url.searchParams.set("per_page", (input.per_page ?? 30).toString());
        url.searchParams.set("page", (input.page ?? 1).toString());
        url.searchParams.set("q", input.query.join(" "));

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
