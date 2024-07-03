import { logger } from "../common";

export async function request(url: URL, init?: RequestInit): Promise<Response> {
    logger.getLogger().info({
        url: url.toString(),
        method: init?.method,
    });

    const startStopwatch = process.hrtime();

    const res = await fetch(url, init);

    const endStopwatch = process.hrtime(startStopwatch);
    const responseTimeInMs = (endStopwatch[0] * 1000000000 + endStopwatch[1]) / 1000000;

    logger.getLogger().info({
        url: url.toString(),
        method: init?.method,
        status: res.status,
        duration: responseTimeInMs,
    });

    return res;
}
