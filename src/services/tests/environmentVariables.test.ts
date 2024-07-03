import { beforeEach, describe, it, mock } from "node:test";
import { loadEnv } from "../env/environmentVariablesService";
import dotenv from "dotenv";
import assert from "node:assert";
import { ValidationError } from "../../common";

describe(loadEnv.name, () => {
    beforeEach(() => {
        mock.reset();
    });

    it("throws if env doesnt fulfill schema", () => {
        const env = {
            GITHUB_API_TOKEN: "token",
            API_URL: "localhost",
            API_PORT: "invalid_port",
            LOG_LEVEL: "info",
        };

        mock.method(dotenv, "config", () => {
            dotenv.populate(process.env as Record<string, string>, env);
        });

        assert.throws(() => loadEnv(), ValidationError);

        Object.keys(env).forEach((e) => {
            delete process.env[e];
        });
    });

    it("loads correctly", () => {
        const env = {
            GITHUB_API_TOKEN: "token",
            API_URL: "localhost",
            API_PORT: "8080",
            LOG_LEVEL: "info",
        };

        const dotEnvMock = mock.method(dotenv, "config", () => {
            dotenv.populate(process.env as Record<string, string>, env);
        });

        assert.doesNotThrow(() => loadEnv());
        assert.equal(dotEnvMock.mock.callCount(), 1);

        Object.keys(env).forEach((e) => {
            delete process.env[e];
        });
    });
});
