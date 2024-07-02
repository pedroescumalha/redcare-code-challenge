import { describe, it } from "node:test";
import { GithubClient } from "../github/githubClient";
import assert from "node:assert";
import { ValidationError } from "../../common";

describe(GithubClient.name, () => {
    it("throws if api key is invalid", () => {
        assert.throws(() => new GithubClient(""), ValidationError);
    });

    it("throws if page is negative", async () => {
        const client = new GithubClient("token");

        await assert.rejects(() => client.searchPublicRepositories({
            query: [],
            page: -10,
        }), ValidationError);
    });

    it("throws if per_page is negative", async () => {
        const client = new GithubClient("token");

        await assert.rejects(() => client.searchPublicRepositories({
            query: [],
            per_page: -10,
        }), ValidationError);
    });

    it("throws if per_page is greater than 100", async () => {
        const client = new GithubClient("token");

        await assert.rejects(() => client.searchPublicRepositories({
            query: [],
            per_page: 101,
        }), ValidationError);
    });
});
