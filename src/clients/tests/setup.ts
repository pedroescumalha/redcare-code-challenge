import { before, beforeEach, mock } from "node:test";
import { logger } from "../../common";

export function setupTest(): void {
    before(() => {
        logger.createLogger({ level: "silent" });
    });

    beforeEach(() => {
        mock.reset();
    });
}
