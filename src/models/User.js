import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    avatar: String,
    username: String,
    email: { type: String, unique: true, sparse: true },
    password: String, // optional for OAuth users
    googleId: String,
    facebookId: String,
    totalScans: { type: Number, default: 0 },
    favoriteScans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scan" }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
