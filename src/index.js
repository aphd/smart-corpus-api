import express from "express";
import bodyParser from "body-parser";
import handleSmacsRequest from "./smacs";
import adaptRequest from "./helpers/adapt-request";

const app = express();
app.use(bodyParser.json());

app.all("/smacs", smacsController);
app.get("/smacs/:id", smacsController);
app.delete("/smacsById/:_id", smacsController);
app.delete("/smacsByHash/:hash", smacsController);

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

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);
