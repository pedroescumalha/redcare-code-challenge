import fastify from "fastify";
import { routes } from "./routes";
import { fastifyZodSchemaPlugin } from "./plugins";
import { loggerService } from "../services";

type Server = {
    port: number;
    host: string;
    start: () => void;
};

const serverOptions = {
    port: 8080,
    host: "localhost",
    logger: loggerService.getLogger,
};

export function buildServer(
    configureServer?: (options: typeof serverOptions) => void
): Server {
    if (configureServer) {
        configureServer(serverOptions);
    }

    const logger = serverOptions.logger();
    // hack to bridge our logger with fastify's logger
    (logger as typeof logger & { child: () => typeof logger }).child = (): typeof logger => logger;

    const server = fastify({ logger });

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
