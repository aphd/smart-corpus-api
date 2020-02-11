import smacPost from "./post-request.mjs";
import readCSV from "./read-csv.mjs";

const w_callback = data => {
    smacPost(JSON.stringify(data), "adr");
};
readCSV("/tmp/smec.csv", w_callback);
