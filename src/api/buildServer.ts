import fastify from "fastify";
import { routes } from "./routes";
import { errorHandler, fastifyZodSchemaPlugin } from "./plugins";
import { logger } from "../common";

type SendRequest = (input: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    query?: Record<string, string>;
}) => Promise<{ status: number, body: unknown }>;

export type Server = {
    port: number;
    host: string;
    start: () => void;
    stop: () => Promise<void>;
    test: () => Promise<{
        sendRequest: SendRequest;
    }>;
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
        test: async (): Promise<{
            sendRequest: SendRequest;
        }> => {
            await server.ready();

            return {
                sendRequest: async (input: {
                    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
                    path: string;
                    headers?: Record<string, string>;
                    body?: Record<string, unknown>;
                    query?: Record<string, string>;
                }): Promise<{ status: number, body: unknown }> => {
                    const response = await server.inject({
                        method: input.method,
                        url: input.path,
                        headers: input.headers,
                        body: input.body,
                        query: input.query,
                    });

                    return {
                        status: response.statusCode,
                        body: response.json(),
                    };
                },
            };
        },
        stop: async (): Promise<void> => {
            await server.close();
        },
    };
}
