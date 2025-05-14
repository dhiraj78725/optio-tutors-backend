const {
  GetIdentityVerificationAttributesCommand,
} = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const run = async (email) => {
  const command = new GetIdentityVerificationAttributesCommand({
    Identities: [email],
  });

  try {
    const response = await sesClient.send(command);
    const attrs = response.VerificationAttributes[email];
    if (!attrs) {
      console.log(`No verification record found for ${email}`);
      return;
    }
    const status = attrs.VerificationStatus;
    return status;
    console.log(`Email: ${email}`);
    console.log(`Status: ${attrs.VerificationStatus}`); // Possible values: "Pending", "Success", "Failed", "TemporaryFailure"
  } catch (err) {
      console.error("Error getting verification status:", err);
    throw new Error(err)
  }
};

module.exports = { run };
