const express = require("express");
const Message = require("../models/ContactUs");
const nodemailer = require("nodemailer");

const clientfeedback = async (req, res) => {
  const newMessage = new Message ({
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message
  })
  try {
    await newMessage.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: newMessage.email,
      to: process.env.EMAIL,
      subject: newMessage.subject,
      html: newMessage.message,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res
          .status(201)
          .json({ success: true, message: "Message Sent Successfully, We will get back to you soon!" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  clientfeedback,
};
