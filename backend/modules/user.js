const mongoose = require('mongoose');
const {Schema} = mongoose;

 const userSchema = new Schema ({
        userId: { type: String, required: true, index: true },
        messages: [{
            role: { type: String, enum: ['user', 'model'], required: true },
            parts: [{text:{ type: String, required: true }}],
        }]
    })

const User = mongoose.model('user',userSchema);

module.exports = User;