const Appointment = require("../models/appointmentModel");

async function createAppointment(req, res) {
  try {
    let  { dateTime, doctorId } = req.body;
    createdBy = req.user.id;
    userID = req.user.id
    console.log(req.body,createdBy, userID)
    dateTime = new Date(dateTime+'Z')
    const newAppoint = await Appointment.create({userID, dateTime, doctorId, createdBy });
    console.log(newAppoint)
    newAppoint.save()
    if (!newAppoint) {
      res.status(200).send({ msg: "appointment not created", success: false });
    }
    res
      .status(200)
      .send({ msg: "appointment created successfully", success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

async function statusUpdateByDoctor(req, res) {
  const { ID } = req.params;
  console.log(ID, "________id_______");
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(ID, {
        $set:{
            status:req.body.status
        }
    },
        { new: true, runValidators: true });
    console.log(updatedAppointment, "updatedAppointment");
    if (!updatedAppointment) {
      res.status(200).send({ msg: "appointment not updated", success: false });
    }
    res
      .status(200)
      .send({ msg: "appointments status updated successfully", success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

async function updateAppointment(req, res) {
  const { ID } = req.params;
  const { dateTime, doctorId } = req.body;

  try {
    if (!dateTime || !doctorId) {
      return res.status(400).json({ msg: "DateTime and doctor are required" });
    }
    const appointment = await Appointment.findByPk(ID);

    if (!appointment)
      return res
        .status(404)
        .json({ msg: "Appointment not found", success: false });

    if (appointment.createdBy !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized", success: false });

    await appointment.update({
      dateTime,
      doctorId,
      updatedBy: req.user.id,
    });

    res
      .status(200)
      .json({ success: true, msg: "Appointment updated", data: appointment });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { ID } = req.params;

    const appointment = await Appointment.findByPk(ID);

    if (!appointment)
      return res
        .status(404)
        .json({ msg: "Appointment not found", success: false });

    if (appointment.createdBy !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized", success: false });

    const appointmentId = Number(req.params.ID);
    const doctorId = Number(req.user.id);

    const deleted = await Appointment.destroy({
      where: {
        id: appointmentId,
        doctorId: doctorId,
      },
    });

    if (!deleted) {
      return res
        .status(200)
        .json({ msg: "Appointment not deleted", success: false });
    }

    return res
      .status(200)
      .json({ msg: "Appointment deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
}

async function getAppointmentsByUser(req, res) {
const uId =req.user.id
  try {
    const appointments = await Appointment.find({userID:uId});
    if(await Appointment.countDocuments({}) == 0){
      res.status(400).send({ msg: "No appointments yet" });
    }
    // appointments.dateTime = appointments.dateTime
    res.status(200).send({ appointments: appointments, success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

async function showAppointmentsOfDoctor(req, res) {
  try {
    // req.userid (docotr id )

    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.id },
    });
    if (appointments.length == 0) {
      res.status(400).send({ msg: "No appointments yet" });
    }
    res.status(200).send({ appointments: appointments, success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
};