import express from "express";
import bodyParser from "body-parser";
import handleContactsRequest from "./smacs";
import adaptRequest from "./helpers/adapt-request";

const app = express();
app.use(bodyParser.json());

app.all("/smacs", contactsController);
app.get("/smacs/:id", contactsController);

function contactsController(req, res) {
    const httpRequest = adaptRequest(req);
    handleContactsRequest(httpRequest)
        .then(({ headers, statusCode, data }) =>
            res
                .set(headers)
                .status(statusCode)
                .send(data)
        )
        .catch(e => res.status(500).end());
}

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);
