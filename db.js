const mongoose = require('mongoose');
// const mongooseUrl = "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb"
const mongooseUrl = "mongodb+srv://Ashhar:12345@clusternote.eow42.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = () => {
    mongoose.connect(mongooseUrl,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },()=>{
        console.log('Connected')
    })
}

module.exports = connectToMongo