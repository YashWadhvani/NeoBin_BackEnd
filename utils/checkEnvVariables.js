// utils/envValidation.js
function checkEnvVariables() {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }
    if (!process.env.PORT) {
        throw new Error("PORT is required")
    }
  }
  
  module.exports = { checkEnvVariables };
  