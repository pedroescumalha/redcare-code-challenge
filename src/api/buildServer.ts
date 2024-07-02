import fastify from "fastify";
import { routes } from "./routes";
import { fastifyZodSchemaPlugin } from "./plugins";

type Server = {
    port: number;
    host: string;
    start: () => void;
};

const serverOptions = {
    port: 8080,
    host: "localhost",
};

export function buildServer(
    configureServer?: (options: typeof serverOptions) => void
): Server {
    const server = fastify({ logger: true });
    
    if (configureServer) {
        configureServer(serverOptions);
    }

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
