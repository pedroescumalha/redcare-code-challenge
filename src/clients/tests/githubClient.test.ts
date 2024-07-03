import { describe, it, mock } from "node:test";
import { GithubClient } from "../github/githubClient";
import assert from "node:assert";
import { HttpError, ValidationError } from "../../common";
import { setupTest } from "./setup";

describe(GithubClient.name, () => {
    setupTest();

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

    it("throws if response code is not 200", async () => {
        const client = new GithubClient("token");
        mock.method(global, "fetch", () => {
            return {
                ok: false,
            };
        });

        await assert.rejects(() => client.searchPublicRepositories({ query: [] }), HttpError);
    });

    it("throws if response doesnt fulfill schema", async () => {
        const client = new GithubClient("token");
        mock.method(global, "fetch", () => {
            return {
                ok: true,
                json: (): Promise<unknown> => {
                    return Promise.resolve({ "dummy": true });
                },
            };
        });

        await assert.rejects(() => client.searchPublicRepositories({ query: [] }), ValidationError);
    });

    it("fetches correctly", async () => {
        const client = new GithubClient("token");
        mock.method(global, "fetch", () => {
            return {
                ok: true,
                json: (): Promise<unknown> => {
                    return Promise.resolve({
                        total_count: 0,
                        incomplete_results: false,
                        items: [],
                    });
                },
            };
        });

        await assert.doesNotReject(() => client.searchPublicRepositories({ query: [] }));
    });
});
