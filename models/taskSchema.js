const mongoose =  require("mongoose")
const Schema = mongoose.Schema;


const taskSchema= new Schema ({

    task : {
        type: String,
        required: true

    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    taskUser: {
        type:Schema.Types.ObjectId,
        ref:"User"
    }

    

})

module.exports = mongoose.model('Task', taskSchema);            