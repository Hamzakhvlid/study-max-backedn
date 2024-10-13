const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL,
  ORDER_CONFIRMATION,
  PAYMENT_CONFIRMATION,
  ORDER_SHIPPED,
  ORDER_CANCELED,
  MESSAGE_EMAIL
} = require("./emailTemplates");
const { mailtrapClient, sender } = require("./mailtrap.config");
const sendEmail = require("../nodemailer/sendEmail");

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Verification Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
    console.log("Verification email sent successfully:", response);
  } catch (error) {
    console.log("Error sending verification email", error);
    throw new Error(`Error sending verification email:${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Welcome Email",
      html: WELCOME_EMAIL.replace(/\[User Name\]/g, name),
    });
    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error(`Error sending welcome email:${error}`);
  }
};


const sendMessageEmail = async (userEmail, userName, userSubject, userPhone, userMessage) => {
  try {
    const response = await sendEmail({
      to: process.env.SMPT_MAIL,
      subject: "Al Noor Fans - Inquiry Message",
      html:MESSAGE_EMAIL.replace("{{userEmail}}", userEmail)
      .replace("{{userName}}", userName)
      .replace("{{userPhone}}", userPhone)
      .replace("{{userSubject}}", userSubject)
      .replace("{{userMessage}}", userMessage),
    })
    console.log("Message email sent successfully:", response);
  } catch (error) {
    console.log("Error sending message email", error);
    throw new Error(`Error sending message email:${error}`);
  }
}

const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Reset password email sent successfully:", response);
  } catch (error) {
    console.log("Error sending reset password email", error);
    throw new Error(`Error sending reset password email:${error}`);
  }
};

const sendSuccessfullPasswordResetMail = async (email) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Reset Password Successfull",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log(
      "Reset password successfull email sent successfully:",
      response
    );
  } catch (error) {
    console.log("Error reseting password", error);
    throw new Error(`Error reseting password:${error}`);
  }
};

const sendOrderConfirmationMail = async (email) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Order Successfully Placed",
      html: ORDER_CONFIRMATION,
    });
    console.log("Order confirmation Mail sent successfully:", response);
  } catch (error) {
    console.log("Error Order confirmation Mail", error);
    throw new Error(`Error Order confirmation Mail:${error}`);
}
};
const sendPaymentConfirmationMail = async (email) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Payment Received Successfully",
      html: PAYMENT_CONFIRMATION,
    });
    console.log("Payment Received Successfully Mail sent successfully:", response);
  } catch (error) {
    console.log("Error Payment Received Mail", error);
    throw new Error(`Error Payment Received Mail:${error}`);
}
};
const sendOrderShippedMail = async (email) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Order Shipped Successfully",
      html: ORDER_SHIPPED,
    });
    console.log("Order Shipped Mail sent successfully:", response);
  } catch (error) {
    console.log("Error Order Shipped Mail", error);
    throw new Error(`Error Order Shipped Mail:${error}`);
}
};
const sendOrderCanceledMail = async (email) => {
  try {
    const response = await sendEmail({
      to: email,
      subject: "Al Noor Fans - Order Canceled",
      html: ORDER_CANCELED,
    });
    console.log("Order Canceled Mail sent successfully:", response);
  } catch (error) {
    console.log("Error Order Canceled Mail", error);
    throw new Error(`Error Order Canceled Mail:${error}`);
}
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSuccessfullPasswordResetMail,
  sendOrderConfirmationMail,
  sendPaymentConfirmationMail,
  sendOrderShippedMail,
  sendOrderCanceledMail,
  sendMessageEmail
};
