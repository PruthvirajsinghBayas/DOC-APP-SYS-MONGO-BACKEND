const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    specialist:{type:String,required:true},
    fees:{type:Number, required:true},
    status:{type:String,
        enum:["Pending",'Accept',"Reject"],
        default:"Pending"
    },
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
},{
    timestamps:true
})






module.exports = mongoose.model('doctor', doctorSchema)