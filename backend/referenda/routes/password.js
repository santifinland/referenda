"use strict";
const nodemailer = require("nodemailer");

const config = require('../config.js');
const Verify = require('./verify');


const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: 587,
  secure: false,
  auth: {
    user: config.mailUser,
    pass: config.mailPass
  }
});

exports.sendMail = function(user) {
  async function main(user) {
    console.log(user.username);
    let token = JSON.stringify(Verify.getToken({"username": user.username})).slice(1, -1);
    let link = "https://referenda.es/reset-password?token=" + token;
    let info = await transporter.sendMail({
      from: '"Referenda.es" <webmaster@referenda.es>',
      to: user.mail,
      subject: "Recordatorio de contraseña",
      text: "Hola.\n\n" +
            "Hemos recibido un recordatorio de contraseña para esta dirección de correo electrónico.\n\n" +
            "Visita" + link + " para renovar tu contraseña\n\n" +
            "Si no has solicitado ningún recordatorio, por favor, olvida este mensaje\n\n" +
            "Saludos. Referenda.es",
      html: "<p>Hola</p>" +
            "<p>Hemos recibido un recordatorio de contraseña para esta dirección de correo electrónico.</p>" +
            "<p>Sigue este <a href=" + link + ">enlace</a> para renovar tu contraseña</p>" +
            "<p>Si no has solicitado ningún recordatorio, por favor, olvida este mensaje</p>" +
            "<p>Saludos. Referenda.es</p>"
    });
    console.log("Message sent: %s", info.messageId);
  }
  main(user).catch(console.error);
};
