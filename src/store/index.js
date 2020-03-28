import IdbKvStore from 'idb-kv-store'

const store = new IdbKvStore('the name of store')


export const get = (key) => {
    return store.get(key)
};

export const set = (key, val) => {
    return store.set(key, val)
}

export const remove = (key) => {
    return store.remove(key)
}

export const getAll = () => {
    const values = [];

    return new Promise((resolve, reject) => {
        store.iterator(function (err, cursor) {
            if (err) throw err;

            if (cursor) { // If we haven't reached the end
                values.push([cursor.key, cursor.value])
                cursor.continue() // This method will be called with the next item
                return;
            }

            resolve(values)
        })
    })
}