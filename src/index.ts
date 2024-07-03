import { buildServer } from "./api";
import { environmentVariablesService } from "./services";

environmentVariablesService.loadEnv();

const server = buildServer((options) => {
    options.host = environmentVariablesService.getEnv("API_URL");
    options.port = environmentVariablesService.getEnv("API_PORT");
});
server.start();
