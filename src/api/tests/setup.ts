import { after, before, beforeEach, mock } from "node:test";
import { buildServer, type Server } from "../buildServer";
import { logger } from "../../common";

type TestingServer = Awaited<ReturnType<Server["test"]>>;

export function setupTest(): { getTestingServer: () => TestingServer } {
    logger.createLogger({ level: "silent" });
    let server: Server | undefined;
    let testingServer: TestingServer | undefined;

    before(async () => {
        server = buildServer();
        testingServer = await server.test();
    });

    after(async () => {
        await server?.stop();
    });

    beforeEach(() => {
        mock.reset();
    });

    return {
        getTestingServer: () => {
            if (!server || !testingServer) {
                throw new Error("Server not initialized");
            }

            return testingServer;
        },
    };
}
