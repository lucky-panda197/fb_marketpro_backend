const mongoose = require('mongoose');

module.exports.connectToMongoDb = async function connectToDb() {
    try {
        await mongoose.
            connect("mongodb://127.0.0.1:27017/vps-db", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            }).then(() => {
                console.log('Connected to database');
            }).catch((err) => {
                console.log('Error connecting to database: ', err);
            });
    } catch (error) {
        console.log('Error connecting to database: ', error);
    }
}