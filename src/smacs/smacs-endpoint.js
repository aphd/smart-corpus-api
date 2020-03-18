import makeHttpError from "../helpers/http-error.js";

export default function makeSmacsEndpointHandler({ smacList }) {
    return async function handle(httpRequest) {
        switch (httpRequest.method) {
            case "POST":
                return postSmac(httpRequest);

            case "GET":
                return getSmacs(httpRequest);

            case "DELETE":
                return deleteSmacs(httpRequest);

            case "PATCH":
                return updateSmac(httpRequest);

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
        try {
            const result = await smacList.add(httpRequest.body);
            return {
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: 201,
                data: JSON.stringify(result)
            };
        } catch (e) {
            return makeHttpError({
                errorMessage: e.message
            });
        }
    }

    async function updateSmac(httpRequest) {
        console.log("updateSmac httpRequest: ", httpRequest);
        const { pathParams, body } = httpRequest;
        const result = await smacList.update(pathParams, body);
        return {
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: 200,
            data: JSON.stringify(result)
        };
    }
}
