import fastify from "fastify";
import { routes } from "./routes";
import { errorHandler, fastifyZodSchemaPlugin } from "./plugins";
import { logger } from "../common";

type Server = {
    port: number;
    host: string;
    start: () => void;
};

const serverOptions = {
    port: 8080,
    host: "localhost",
    logger: logger.getLogger,
};

export function buildServer(
    configureServer?: (options: typeof serverOptions) => void
): Server {
    if (configureServer) {
        configureServer(serverOptions);
    }

    const server = fastify({
        logger: serverOptions.logger(),
    });

    server.setErrorHandler(errorHandler);

    server.register(fastifyZodSchemaPlugin);

    routes.forEach((route) => {
        server.register(route);
    });

    return {
        host: serverOptions.host,
        port: serverOptions.port,
        start: (): void => {
            server.listen({
                port: serverOptions.port,
                host: serverOptions.host,
            }, (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            });
        },
    };
}
