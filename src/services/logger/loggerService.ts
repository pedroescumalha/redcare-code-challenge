import pino from "pino";
import { ValidationError, type LogLevel } from "../../common";

type LoggerOptions = {
    level: LogLevel;
}

class Logger {
    private readonly options: LoggerOptions;
    private readonly pino: ReturnType<typeof pino>;

    constructor(options: LoggerOptions) {
        this.options = options;
        this.pino = pino({
            level: options.level,
        });
    }

    public debug(log: string): void {
        this.pino.debug(log);
    }

    public info(log: string): void {
        this.pino.info(log);
    }

    public warn(log: string): void {
        this.pino.warn(log);
    }

    public error(log: string | Error): void {
        this.pino.error(log);
    }
}

let logger: Logger | undefined = undefined;

export function createLogger(loggerOptions: LoggerOptions): Logger {
    if (logger) {
        return logger;
    }

    logger = new Logger(loggerOptions);
    return logger;
}

export function getLogger(): Logger {
    if (!logger) {
        throw new ValidationError("logger has not been instantiated.");
    }

    return logger;
}
