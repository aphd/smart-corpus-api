import express from "express";
import bodyParser from "body-parser";
import handleSmacsRequest from "./smacs";
import adaptRequest from "./helpers/adapt-request";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.all("/", smacsController);
app.all("/byType/:Type", smacsController);
app.all("/byCV/:CV", smacsController);

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
            console.log(next("handleSmacsRequest error: ", err));
        });
}

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);
