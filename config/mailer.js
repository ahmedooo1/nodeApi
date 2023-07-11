const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Utilisez le bon nom d'hôte pour Outlook 365
  port: 587,
  secure: false, // false pour le port 587, true pour le port 465
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_SECRET,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

module.exports = transporter;