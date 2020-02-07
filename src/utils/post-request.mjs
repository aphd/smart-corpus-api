import http from "http";

export default function smacPost(data, options) {
    const req = http.request(options, res => {
        console.log(res);
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);
    });
    req.on("error", e => {
        console.error("errorerer\n\n", e);
    });
    req.write(data);
    req.end();
}
