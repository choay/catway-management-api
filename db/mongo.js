const mongoose = require('mongoose');

const clientOptions = {
    useNewUrlParser : true,
    dbName          :'apinode'
};

exports.initClientDbConnection = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI, clientOptions)
        console.log('connected')
    } catch(error) {
        console.log(error);
        throw error;
    }
}