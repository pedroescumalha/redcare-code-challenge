import { buildServer } from "./api";
import { environmentVariablesService } from "./services";

environmentVariablesService.loadEnv();

const server = buildServer();
server.start();
