import pino, { type Logger } from "pino";
import { ValidationError } from "./errors";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "silent";

type LoggerOptions = {
    level: LogLevel;
}

let logger: Logger | undefined = undefined;

export function createLogger(loggerOptions: LoggerOptions): Logger {
    if (logger) {
        return logger;
    }

    logger = pino(loggerOptions);
    return logger;
}

export function getLogger(): Logger {
    if (!logger) {
        throw new ValidationError("logger has not been instantiated.");
    }

    return logger;
}
