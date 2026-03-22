/**
 * Usage:
 *   node scripts/makeAdmin.js your@email.com
 *
 * Run from inside the /server folder.
 */

const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const User     = require("../models/User");

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error("❌  Please provide an email:  node scripts/makeAdmin.js your@email.com");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isAdmin: true } },
      { new: true }
    );

    if (!user) {
      console.error(`❌  No user found with email: ${email}`);
    } else {
      console.log(`✅  ${user.name} (${user.email}) is now an admin.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  });
