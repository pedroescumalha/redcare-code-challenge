import { getRepositoriesScoreRoute } from "./repositories/getRepositoriesScoreRoute";
import { healthCheckRoute } from "./health/healthCheckRoute";

export const routes = [
    getRepositoriesScoreRoute,
    healthCheckRoute,
];
