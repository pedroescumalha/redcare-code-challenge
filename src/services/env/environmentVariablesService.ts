import z from "zod";
import { ValidationError } from "../../common";
import assert from "assert";
import dotenv from "dotenv";

const schema = z.object({
    GITHUB_API_TOKEN: z.string(),
});

type Environment = z.infer<typeof schema>;

let environment: Environment | undefined = undefined;

export function loadEnv(): void {
    if (environment) {
        return;
    }

    dotenv.config();

    const parse = schema.safeParse(process.env);
    assert(parse.success, new ValidationError("Error parsing environment variables."));

    environment = parse.data;
}

export function getEnv<T extends keyof Environment>(key: T): Environment[T] {
    assert(environment, new ValidationError("Environment variables are not loaded."));
    return environment[key];
}
