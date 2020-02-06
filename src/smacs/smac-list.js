import makeSmac from "./smac";
import { UniqueConstraintError } from "../helpers/errors";

export default function makeSmacList({ database }) {
    const collection = "smacs";

    return Object.freeze({
        add,
        findByHash,
        findById,
        getItems,
        remove,
        replace,
        update
    });

    async function getItems({ max = 100, before, after } = {}) {
        const db = await database;
        const query = {};
        if (before || after) {
            query._id = {};
            query._id = before
                ? { ...query._id, $lt: db.makeId(before) }
                : query._id;
            query._id = after
                ? { ...query._id, $gt: db.makeId(after) }
                : query._id;
        }

        return (
            await db
                .collection(collection)
                .find(query)
                .limit(Number(max))
                .toArray()
        ).map(documentToSmac);
    }

    async function add({ smacId, ...smac }) {
        const db = await database;
        if (smacId) {
            smac._id = db.makeId(smacId);
        }
        const { result, ops } = await db
            .collection(collection)
            .insertOne(smac)
            .catch(mongoError => {
                const [errorCode] = mongoError.message.split(" ");
                if (errorCode === "E11000") {
                    const [_, mongoIndex] = mongoError.message
                        .split(":")[2]
                        .split(" ");
                    throw new UniqueConstraintError(
                        mongoIndex === "ContactEmailIndex" ? "hash" : "smacId"
                    );
                }
                throw mongoError;
            });
        return {
            success: result.ok === 1,
            created: documentToSmac(ops[0])
        };
    }

    async function findById({ smacId }) {
        const db = await database;
        const found = await db
            .collection(collection)
            .findOne({ _id: db.makeId(smacId) });
        if (found) {
            return documentToSmac(found);
        }
        return null;
    }

    async function findByHash({ hash }) {
        const db = await database;
        const results = await db
            .collection(collection)
            .find({ hash })
            .toArray();
        return results.map(documentToSmac);
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
    async function update(smac) {}

    function documentToSmac({ _id: smacId, ...doc }) {
        return makeSmac({ smacId, ...doc });
    }
}
