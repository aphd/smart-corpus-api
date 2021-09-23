import express from "express";
import bodyParser from "body-parser";
import handleSmacsRequest from "./smacs/index.js";
import adaptRequest from "./helpers/adapt-request.js";
import cors from "cors";
import { getContractData } from "./services/index.js";

const app = express();
app.use(express.json({ limit: "150mb" }));

app.use(bodyParser.json());
app.use(cors());

app.all("/", smacsController);
app.all("/:object", smacsController);

function smacsController(req, res, next) {
    const httpRequest = adaptRequest(req);
    handleSmacsRequest(httpRequest)
        .then(({ headers, statusCode, data }) => {
            res.set(headers)
                .status(statusCode)
                .send(data);
        })
        .catch((err) => {
            console.error(next("handleSmacsRequest error: ", err.stack));
        });
}

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);
