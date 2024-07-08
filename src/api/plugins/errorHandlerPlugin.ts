import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpError, ValidationError } from "../../common/errors";

type ErrorHandler = (error: Error, request: FastifyRequest, reply: FastifyReply) => void;
type ApiError = { statusCode: number, message: string };

const statusCodes = {
    [ValidationError.constructor.name]: 400,
    [HttpError.constructor.name]: 400,
    default: 500,
};

export const errorHandler: ErrorHandler = (error, _, reply) => {
    const apiError = getApiError(error);
    reply.status(apiError.statusCode).send(apiError);
};

function getApiError(error: Error): ApiError {
    let statusCode = statusCodes[error.constructor.name];
    
    if (!statusCode) {
        statusCode = statusCodes.default;
    }

    return { statusCode, message: error.message };
}

