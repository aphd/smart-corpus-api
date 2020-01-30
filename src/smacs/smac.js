import requiredParam from "../helpers/required-param";
import { InvalidPropertyError } from "../helpers/errors";
import isValidEmail from "../helpers/is-valid-email.js";
import upperFirst from "../helpers/upper-first";

export default function makeSmac(contactInfo = requiredParam("contactInfo")) {
    const validContact = validate(contactInfo);
    const normalContact = normalize(validContact);
    return Object.freeze(normalContact);

    function validate({
        hash = requiredParam("hash"),
        // lastName = requiredParam("lastName"),
        // emailAddress = requiredParam("emailAddress"),
        ...otherInfo
    } = {}) {
        validateHash("hash", hash);
        // validateName("last", lastName);
        // validateEmail(emailAddress);
        return { hash, ...otherInfo };
        return { firstName, lastName, emailAddress, ...otherInfo };
    }

    function validateHash(label, hash) {
        if (hash.length !== 42) {
            throw new InvalidPropertyError(
                `An ${label} must be 42 characters long. Yours is ${hash.length}`
            );
        }
    }

    function validateEmail(emailAddress) {
        if (!isValidEmail(emailAddress)) {
            throw new InvalidPropertyError("Invalid contact email address.");
        }
    }

    function normalize({ emailAddress, hash, lastName, ...otherInfo }) {
        return {
            ...otherInfo,
            hash: upperFirst(hash)
            // lastName: upperFirst(lastName)
            // emailAddress: emailAddress.toLowerCase()
        };
    }
}
