import express from "express";
import Candidate from "../models/Canditate.js";

const router = express.Router();

// POST: Create a new candidate
router.post("/new-candidate", async (req, res) => {
  const { CandidateName, EmailAddress, PhoneNumber, Position, Experience } = req.body;

  if (!CandidateName || !EmailAddress || !PhoneNumber || !Position || !Experience ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingCandidate = await Candidate.findOne({ EmailAddress });
    if (existingCandidate) {
      return res.status(409).json({ message: "Candidate already exists with this email" });
    }

    const newCandidate = await Candidate.create({
      CandidateName,
      EmailAddress,
      PhoneNumber,
      Position,
      Experience,
      
    //   Status: Status || "pending"
    });

    console.log("New Candidate Created:", newCandidate);
    return res.status(201).json({ message: "Candidate created", candidate: newCandidate });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});
router.get('/', async (req, res) => {
  try {
    const allCandidates = await Candidate.find();
    res.status(200).json({ message: 'All candidates fetched', allCandidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});
// PUT: Update candidate status by ID
router.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  if (!id) return res.status(400).json({ message: "Candidate ID is required" });
  if (!Status) return res.status(400).json({ message: "Status is required" });

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      { Status },
      { new: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      message: "Candidate status updated",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});


router.delete("/delete-candidate/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const deletedUser = await Candidate.deleteOne({ _id: id });

    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: "No candidate found with this ID" });
    }

    console.log("✅ User has been deleted:", deletedUser);
    res.status(200).json({
      message: "User has been deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// DELETE: Remove all candidates
router.delete("/candidates", async (req, res) => {
  try {
    const deleted = await Candidate.deleteMany({});
    console.log("✅ All candidates deleted:", deleted);

    res.status(200).json({
      message: "All candidates deleted successfully",
      deletedCount: deleted.deletedCount
    });
  } catch (error) {
    console.error("❌ Error deleting candidates:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
