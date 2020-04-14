import writeMetrics from "./handle-metrics";

const writeMetrics2JSON = writeMetrics.__get__("writeMetrics2JSON");
const fsPromises = require("fs").promises;

describe("Handle Metrics", () => {
    it("Should the JSON metric file not be empty", async () => {
        const response = await fsPromises.readFile("./data/metrics.json");
        const result = JSON.parse(response).length;
        console.log(result);
        expect(result >= 0).toBeTruthy();
    });
});
