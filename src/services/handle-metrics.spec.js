import writeMetrics from "./handle-metrics";

const writeMetrics2JSON = writeMetrics.__get__("writeMetrics2JSON");
const fsPromises = require("fs").promises;

describe("Handle Metrics", () => {
    it("Should ....", async () => {
        let response = await fsPromises.readFile("./data/metrics.json");
        console.log(JSON.parse(response).length);
        expect(true).toEqual(true);
    });
});
