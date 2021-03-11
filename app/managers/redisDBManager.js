const
    {redis} = require('config');

const client = require('redis').createClient({
    host: redis.host,
    port: redis.port
});

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on("error", (error) => {
    console.error(error);
});

/**
 * Отримуєм id за довжиною hash
 * @return {Promise}
 */
 const getUserID = () => {
    return new Promise(resolve => {
        client.hlen ("usersHash",  (err, number) => {
            if (err) console.error(err);
            resolve (number);
        });

    })
}

/**
 * Приймає дані у вигляді {'0':'{}','1':'{}'} ключ-значення
 * Виводить дані з БД у форматі [{},{}]
 */
 const viewToJSON = (data) => {
    if(data !== null) {
        let result = [];
        for (let i in data) {
            result.push(JSON.parse(data[i]))
        }
        return result;
    }
    return ['база пуста'];
}

module.exports = {

    /**
     * Get all records from memory DB
     * @return {Promise}
     */
    getAll:  function getAllFromDb() {
        return new Promise(resolve => {
            client.hgetall("usersHash", (err, res) => {
                if (err) console.error(err);
                resolve(viewToJSON(res));
            })
        })
    },

    /**
     * Get record by id from memory DB
     * @param id
     * @return {Promise}
     */
    getById:  function getIdFromDb(id) {
        return new Promise(resolve => {
            client.hget("usersHash",Number(id), (err, res) => {
                if (err) console.error(err);
                resolve(res);
            })
        })
    },

    /**
     * Add new record to memory DB
     * @param name
     * @return {Promise}
     */
    setNewId:  async function setNewIdToDb(name) {
        let id = await getUserID();
        if(id !== undefined && name  !== undefined){
            let user = {id,name};
            return new Promise(resolve => {
                client.hmset("usersHash", Number(id),JSON.stringify(user), (err, res) => {
                    if (err) console.error(err);
                    resolve(res);
                })
            })
        }
    },

    /**
     * Update record into memory DB
     * @param id
     * @param name
     * @return {Promise}
     */
    updateId: function updateIdToDb(id,name){
        return new Promise(resolve => {
            client.hmset("usersHash", Number(id), JSON.stringify({id:Number(id), name}), (err, res) => {
                if (err) console.error(err);
                resolve(res);

            })
        })
    },

    /**
     * Remove record from memory DB
     * @param id
     * @return {Promise}
     */
    removeId: function removeIdInDb(id) {
        //видаляє по object по по індексу key "id"
            return new Promise(resolve => {
                client.hdel("usersHash",String(id), (err, res) => {
                    if (err) console.error(err);
                    resolve();
                })
            })
        }


};
