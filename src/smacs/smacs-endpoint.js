import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
} from "../helpers/errors";
import makeHttpError from "../helpers/http-error";
import makeSmac from "./smac";

export default function makeSmacsEndpointHandler({ smacList }) {
    return async function handle(httpRequest) {
        switch (httpRequest.method) {
            case "POST":
                return postSmac(httpRequest);

            case "GET":
                return getSmacs(httpRequest);

            case "DELETE":
                return deleteSmacs(httpRequest);

            default:
                return makeHttpError({
                    statusCode: 405,
                    errorMessage: `${httpRequest.method} method not allowed.`
                });
        }
    };

    async function deleteSmacs(httpRequest) {
        const query = httpRequest.pathParams || {};
        const result = await smacList.remove(query);

        return {
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: 200,
            data: JSON.stringify(result)
        };
    }

    async function getSmacs(httpRequest) {
        const result = await smacList.getItems(httpRequest.pathParams);
        return {
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: 200,
            data: JSON.stringify(result)
        };
    }

    async function postSmac(httpRequest) {
        let smacInfo = httpRequest.body;
        if (!smacInfo) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: "Bad request. No POST body."
            });
        }

        if (typeof httpRequest.body === "string") {
            try {
                smacInfo = JSON.parse(smacInfo);
            } catch {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: "Bad request. POST body must be valid JSON."
                });
            }
        }

        try {
            const smac = makeSmac(smacInfo);
            const result = await smacList.add(smac);
            return {
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: 201,
                data: JSON.stringify(result)
            };
        } catch (e) {
            return makeHttpError({
                errorMessage: e.message,
                statusCode:
                    e instanceof UniqueConstraintError
                        ? 409
                        : e instanceof InvalidPropertyError ||
                          e instanceof RequiredParameterError
                        ? 400
                        : 500
            });
        }
    }
}
