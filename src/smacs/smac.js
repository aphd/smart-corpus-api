import requiredParam from "../helpers/required-param";
import { InvalidPropertyError } from "../helpers/errors";
import upperFirst from "../helpers/upper-first";

export default function makeSmac(contactInfo = requiredParam("contactInfo")) {
    const validContact = validate(contactInfo);
    const normalContact = normalize(validContact);
    return Object.freeze(normalContact);

    function validate({ hash = requiredParam("hash"), ...otherInfo } = {}) {
        validateHash("hash", hash);
        return { hash, ...otherInfo };
    }

    function validateHash(label, hash) {
        if (hash.length !== 42) {
            throw new InvalidPropertyError(
                `An ${label} must be 42 characters long. Yours is ${hash.length}`
            );
        }
    }

    function normalize({ emailAddress, hash, lastName, ...otherInfo }) {
        return {
            ...otherInfo,
            hash: upperFirst(hash)
        };
    }
}
