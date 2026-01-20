const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

const applyDoctor = async (req, res) => {
  try {
    const { specialist, fees } = req.body;
    const createdBy = req.user.id;
    const userID = req.user.id;
    console.log(req.body, createdBy, "********");
    const newDoc = await Doctor.create({ userID, specialist, fees, createdBy });
    console.log(newDoc, "&&&&&&&&&&&&&&newDoc");
    await newDoc.save();
    console.log(newDoc, "&&&&&&&&&&&&&&newDoc");
    if (newDoc) {
      res
        .status(200)
        .send({ msg: "doctor applied successfully", success: true });
    } else {
      res
        .status(200)
        .send({ msg: "doctor not applied successfully", success: false });
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};

const docStatus = async (req, res) => {
  try {
  
    const DoctorID = req.params.DoctorID;
    console.log(req.user.id, "admin", req.params.DoctorID, "DoctorID");
    const getDoctor = await Doctor.findById(DoctorID);
    console.log(getDoctor);
    if (!getDoctor) {
      res.status(400).send({ msg: "Doctor not found", success: true });
    } else {
      

      const updatedDoc = await Doctor.findByIdAndUpdate(
        DoctorID,
        {
          $set: { status: req.body.status },
        },
        { new: true, runValidators: true }
      );
      console.log("updatedDoc",updatedDoc)
      if (!updatedDoc) {
        res.status(400).send({ msg: "Doctor not found", success: true });
      }
      if(updatedDoc.status == 'Accept'){
            newDoctorUser = await User.findByIdAndUpdate(updatedDoc.userID,{
                $set:{role:"Doctor"}
            })
            res.status(202).send({msg:"Doctor ban gaye AAP Congratulations..."})
      }else{
res
        .status(200)
        .send({ msg: "doctor updated successfully", success: true });
      }
      
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};



async function docApplyList  (req,res){
try {
    const doctorAplyList = await Doctor.find({status:"Pending"})
    res.status(200).send({doc:doctorAplyList, success:true})
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}



module.exports = {
  applyDoctor,
  docStatus,
//   getDoctorInfo,
//   updateDoctor,
//   deleteDoctor,
docApplyList
};