import makeDb from "../db";
import makeSmacList from "./smac-list";
import makeSmacsEndpointHandler from "./smacs-endpoint";

const database = makeDb();
const smacList = makeSmacList({ database });
const contactsEndpointHandler = makeSmacsEndpointHandler({ smacList });

export default contactsEndpointHandler;
