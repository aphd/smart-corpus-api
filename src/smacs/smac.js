import requiredParam from "../helpers/required-param";
import { InvalidPropertyError } from "../helpers/errors";
import upperFirst from "../helpers/upper-first";

export default function makeSmac(smacInfo = requiredParam("smacInfo")) {
    const validSmac = validate(smacInfo);
    const normalSmac = normalize(validSmac);
    return Object.freeze(normalSmac);

    function validate({
        address = requiredParam("address"),
        ...otherInfo
    } = {}) {
        validateAddress("address", address);
        return { address, ...otherInfo };
    }

    function validateAddress(label, address) {
        if (address.length !== 42) {
            throw new InvalidPropertyError(
                `An ${label} must be 42 characters long. Yours is ${address.length}`
            );
        }
    }

    function normalize({ address, ...otherInfo }) {
        return {
            ...otherInfo,
            address: upperFirst(address)
        };
    }
}
