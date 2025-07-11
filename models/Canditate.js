import mongoose, { Schema } from "mongoose";

const CandidateSchema = new Schema(
  {
    CandidateName: {
      type: String,
      required: [true, "Candidate name is required"]
    },
    EmailAddress: {
      type: String,
      required: [true, "Email address is required"],
      unique: true
    },
    Position: {
      type: String,
      required: [true, "Position is required"]
    },
    PhoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Must be 10 digits
        },
        message: "Phone number should be 10 digits"
      }
    },
    Status: {
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending"
    },
  
    Experience: {
      type: Number,
      required: [true, "Experience is required"]
    }
  },
  {
    timestamps: true
  }
);

const Candidate = mongoose.model("canditates", CandidateSchema);
export default Candidate;
