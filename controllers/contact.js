const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Configurez votre clé API Sendinblue
  SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const api = new SibApiV3Sdk.TransactionalEmailsApi();

  const mailOptions = {
    sender: { email: email, name: name },
    subject: name,
    htmlContent: message,
    // Mettez l'adresse e-mail du destinataire ici
    to: [{ email: process.env.MAILER_EMAIL }],
  };

  try {
    const data = await api.sendTransacEmail(mailOptions);
    console.log(data);
    res.status(200).send({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error); // Affiche l'erreur dans la console

    res.status(500).send({ message: "Erreur lors de l'envoi de l'email", error: error.message });
  }
};
