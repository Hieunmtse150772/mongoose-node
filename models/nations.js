const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        require: true
    }
},
    {
        timestamps: true
    });
var nations = mongoose.model('nations', nationSchema);
module.exports = nations;