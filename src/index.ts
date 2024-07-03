import { buildServer } from "./api";
import { logger } from "./common";
import { environmentVariablesService } from "./services";

environmentVariablesService.loadEnv();

logger.createLogger({
    level: environmentVariablesService.getEnv("LOG_LEVEL"),
});

const server = buildServer((options) => {
    options.host = environmentVariablesService.getEnv("API_URL");
    options.port = environmentVariablesService.getEnv("API_PORT");
    options.logger = logger.getLogger;
});

server.start();
