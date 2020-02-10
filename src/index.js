import express from "express";
import bodyParser from "body-parser";
import handleSmacsRequest from "./smacs";
import adaptRequest from "./helpers/adapt-request";
import cors from "cors";
const fs = require("fs");

const https = require("https");
const http = require("http");
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf8");
const certificate = fs.readFileSync(process.env.CERTIFICATE, "utf8");
const credentials = { key: privateKey, cert: certificate };
const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use(bodyParser.json());
app.use(cors());

app.all("/smacs", smacsController);
app.get("/smacsById/:_id", smacsController);
app.get("/smacsByHash/:hash", smacsController);
app.delete("/smacsById/:_id", smacsController);
app.delete("/smacsByHash/:hash", smacsController);
app.patch("/smacsById/:_id", smacsController);
app.patch("/smacsByHash/:hash", smacsController);

function smacsController(req, res, next) {
    const httpRequest = adaptRequest(req);
    handleSmacsRequest(httpRequest)
        .then(({ headers, statusCode, data }) =>
            res
                .set(headers)
                .status(statusCode)
                .send(data)
        )
        .catch(err => {
            console.log(next("handleSmacsRequest error", err));
        });
}
httpServer.listen(process.env.HTTP_PORT, () =>
    console.log(`httpServer Listening on port ${process.env.HTTP_PORT}`)
);
httpsServer.listen(process.env.HTTPs_PORT, () =>
    console.log(`httpServers Listening on port ${process.env.HTTPs_PORT}`)
);
