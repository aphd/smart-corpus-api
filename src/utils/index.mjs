import smacPost from "./post-request.mjs";
import readCSV from "./read-csv.mjs";
import dotenv from "dotenv";

dotenv.config();

readCSV("/tmp/test.csv", data => {
    console.log("process.env.PORT: ", process.env.PORT);
    smacPost(JSON.stringify(data), {
        hostname: "localhost",
        port: process.env.PORT,
        path: "/adr",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
});
