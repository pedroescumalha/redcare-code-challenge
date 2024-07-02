import type { FastifyRouteSchemaDef } from "fastify/types/schema";
import fp from "fastify-plugin";
import type { ZodError, ZodSchema } from "zod";

type ZodValidatorOutput = { value: unknown } | { error: ZodError<unknown> };

export const fastifyZodSchemaPlugin = fp((fastify, _, done) => {
    fastify.setValidatorCompiler((schemaDef: FastifyRouteSchemaDef<ZodSchema>) => {
        return (data): ZodValidatorOutput => {
            const res = schemaDef.schema.safeParse(data);
            return res.success ? { value: res.data } : { error: res.error };
        };
    });

    done();
});
