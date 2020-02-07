import makeSmac from "./smac";
import { UniqueConstraintError } from "../helpers/errors";

export default function makeSmacList({ database }) {
    const collection = "smacs";

    return Object.freeze({
        add,
        getItems,
        remove,
        replace,
        update
    });

    async function getItems(query) {
        const db = await database;
        const max = 100;
        if (query._id) {
            query._id = db.makeId(query._id);
        }

        return (
            await db
                .collection(collection)
                .find(query)
                .limit(Number(max))
                .toArray()
        ).map(documentToSmac);
    }

    async function add(postBody) {
        const db = await database;
        const { result, ops } = await db
            .collection(collection)
            .insertMany(postBody)
            .catch(mongoError => {
                console.log("mongoError.message: ", mongoError.message);
                throw mongoError;
            });
        return {
            success: result.ok === 1
        };
    }

    async function remove(query) {
        const db = await database;
        if (query._id) {
            query._id = db.makeId(query._id);
        }
        const { result } = await db.collection(collection).deleteOne(query);
        return result.n;
    }

    // todo:
    async function replace(smac) {}

    // todo:
    async function update(query, body) {
        const db = await database;
        if (query._id) {
            query._id = db.makeId(query._id);
        }

        return await db
            .collection(collection)
            .findOneAndUpdate(query, { $set: body }, {});
    }

    function documentToSmac({ _id: smacId, ...doc }) {
        return makeSmac({ smacId, ...doc });
    }
}
