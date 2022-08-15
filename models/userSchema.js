const mongoose =  require("mongoose")
const Schema = mongoose.Schema;


const userSchema= new Schema ({
    username : {
        type: String ,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    list:[{
        type: Schema.Types.ObjectId,
        ref: "Task"
    }]

})

module.exports = mongoose.model('User', userSchema);