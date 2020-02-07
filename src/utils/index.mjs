import smacPost from "./post-request.mjs";
import readCSV from "./read-csv.mjs";

readCSV("/tmp/test.csv", data => {
    smacPost(JSON.stringify(data), {
        hostname: "localhost",
        port: 9090,
        path: "/smacs",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
});
