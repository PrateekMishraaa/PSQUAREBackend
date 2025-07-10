// models/User.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,                 
      required: true,
      minlength: [10, "Phone must be 10 digits"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be ≥ 8 characters"],
      select: false,                
    },
    role: {
      type: String,
      enum: ["user", "hr"],        // restrict allowed values
      default: "user",             // default role on signup
    }
  },
  { timestamps: true }
);

/* ---------- HASH BEFORE SAVE ---------- */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();      // already hashed
  const salt = await bcrypt.genSalt(10);                // cost‑factor 10 ≈ good trade‑off
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ---------- INSTANCE METHOD TO VERIFY ---------- */
UserSchema.methods.matchPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
