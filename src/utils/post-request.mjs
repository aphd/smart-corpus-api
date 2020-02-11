import http from "http";
import dotenv from "dotenv";

dotenv.config();

const options = {
    hostname: "localhost",
    port: process.env.PORT,
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

export default function smacPost(data, path) {
    options.path = "/" + path;

    const req = http.request(options, res => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);
    });
    req.on("error", e => {
        console.error("errorerer\n\n", e);
    });
    req.write(data);
    req.end();
}
