import { describe, it } from "node:test";
import { setupTest } from "./setup";
import assert from "node:assert";

describe("health check", () => {
    const setup = setupTest();

    const path = "/v1/health";

    it("returns 200", async () => {
        const res = await setup.getTestingServer().sendRequest({ method: "GET", path });
        assert.equal(res.status, 200);
    });
});
