import { buildServer } from "./api";
import { environmentVariablesService, loggerService } from "./services";

environmentVariablesService.loadEnv();
loggerService.createLogger({
    level: environmentVariablesService.getEnv("LOG_LEVEL"),
});

const server = buildServer((options) => {
    options.host = environmentVariablesService.getEnv("API_URL");
    options.port = environmentVariablesService.getEnv("API_PORT");
    options.logger = loggerService.getLogger;
});
server.start();
