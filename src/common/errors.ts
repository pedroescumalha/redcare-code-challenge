export class HttpError extends Error {
    constructor(input: {
        status: number;
        endpoint: string;
        method: string;
    }) {
        super();
        this.message = `Invalid http status return code.
            Status: ${input.status}.
            Endpoint: ${input.endpoint}.
            Method: ${input.method}.`;
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super();
        this.message = `Invalid operation: ${message}`;
    }
}
