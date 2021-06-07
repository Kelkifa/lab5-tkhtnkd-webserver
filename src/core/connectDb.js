const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/esp32_tkhtnkd', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('[SERVER] connect to mongodb successfully')
    } catch (error) {
        console.log("[SERVER] connect to mongodb fail...")
    }

}

module.exports = { connect }
