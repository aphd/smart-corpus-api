const get_version = require("./paso").__get__("get_version");
describe("Metrics from PASO", () => {
    it("Should get_version not be defined", () => {
        expect(get_version(`"nam.2.3"`)).toEqual("Not defined");
    });
    it("Should get_version be defined", () => {
        expect(get_version(`"name":"solidity","value":"^0.2.3"`)).toBeDefined();
    });
});
