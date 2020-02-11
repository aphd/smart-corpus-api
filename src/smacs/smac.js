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
        address = validateAddress("address", address);
        return { address, ...otherInfo };
    }

    function validateAddress(label, address) {
        if (address.length !== 42) {
            return "0x" + address.split("_")[0];
        }
        return address;
    }

    function normalize({ address, ...otherInfo }) {
        return {
            ...otherInfo,
            address: upperFirst(address)
        };
    }
}
