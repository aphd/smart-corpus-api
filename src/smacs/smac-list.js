export default function makeSmacList({ database }) {
    //TODO it needs to be parameterized
    const collection = "metrics";

    return Object.freeze({
        add,
        getItems,
        remove,
        update
    });

    async function getItems(query) {
        const db = await database;
        // const MAX_ITEMS = 1000;
        if (query.object) {
            query = JSON.parse(query.object);
        }

        return await db
            .collection(collection)
            .find(query)
            // .limit(Number(MAX_ITEMS))
            .toArray();
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

    async function update(query, body) {
        const db = await database;
        if (query._id) {
            query._id = db.makeId(query._id);
        }

        return await db
            .collection(collection)
            .findOneAndUpdate(query, { $set: body }, {});
    }
}
