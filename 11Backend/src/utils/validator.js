const validator = require("validator");

const validate = (data) => {
  const mandatoryField = ["firstName", "emailId", "password"];

  const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

  if (!IsAllowed) throw new Error("Some Field Missing");

  if (!validator.isEmail(data.emailId)) throw new Error("Invalid Email");

  if (!validator.isLength(data.password, { min: 8 })) {
    throw new Error("Password must be at least 8 characters");
  }
};

module.exports = validate;
