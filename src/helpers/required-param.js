import { RequiredParameterError } from "./errors.js";

export default function requiredParam(param) {
    throw new RequiredParameterError(param);
}
