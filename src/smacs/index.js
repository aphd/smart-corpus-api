import makeDb from "../db/index.js";
import makeSmacList from "./smac-list.js";
import makeSmacsEndpointHandler from "./smacs-endpoint.js";

const database = makeDb();
const smacList = makeSmacList({ database });
const smacsEndpointHandler = makeSmacsEndpointHandler({ smacList });

export default smacsEndpointHandler;
