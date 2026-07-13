import AppraisalCycle from "../models/AppraisalCycle.js";
import Goal from "../models/Goal.js";
import KRA from "../models/KRA.js";
import Skill from "../models/Skill.js";
import Appraisal from "../models/Appraisal.js";
import User from "../models/User.js";

// === APPRAISAL CYCLES (HR) ===
export const getAppraisalCycles = async (req, res) => {
  try {
    const cycles = await AppraisalCycle.find().populate('includedEmployees', 'name email');
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cycles" });
  }
};

export const createAppraisalCycle = async (req, res) => {
  try {
    const newCycle = new AppraisalCycle(req.body);
    await newCycle.save();
    res.status(201).json(newCycle);
  } catch (error) {
    res.status(500).json({ message: "Failed to create cycle", error: error.message });
  }
};

export const getActiveAppraisalCycle = async (req, res) => {
  try {
    const cycle = await AppraisalCycle.findOne({ status: 'Active' });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active cycle" });
  }
};

// === APPRAISALS (Assignments and Reviews) ===
export const assignAppraisals = async (req, res) => {
  try {
    const { cycleId, assignments } = req.body;
    // assignments is an array: { employeeId, peerReviewerId, managerId }
    for (let assign of assignments) {
      // Create Self Appraisal entry
      await Appraisal.create({
        cycleId,
        employeeId: assign.employeeId,
        reviewerId: assign.employeeId,
        type: 'Self'
      });
      // Peer
      if (assign.peerReviewerId) {
        await Appraisal.create({
          cycleId,
          employeeId: assign.employeeId,
          reviewerId: assign.peerReviewerId,
          type: 'Peer'
        });
      }
      // Manager
      if (assign.managerId) {
        await Appraisal.create({
          cycleId,
          employeeId: assign.employeeId,
          reviewerId: assign.managerId,
          type: 'Manager'
        });
      }
    }
    res.json({ message: "Appraisals assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign appraisals", error: error.message });
  }
};

export const getMyAppraisals = async (req, res) => {
  try {
    const { userId } = req.user;
    // Appraisals where I am the reviewer
    const appraisals = await Appraisal.find({ reviewerId: userId })
      .populate('employeeId', 'name email')
      .populate('cycleId', 'name');
    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your appraisals" });
  }
};

export const getEmployeeAppraisals = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const appraisals = await Appraisal.find({ employeeId }).populate('reviewerId', 'name email').populate('cycleId', 'name');
    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee appraisals" });
  }
};

export const submitAppraisal = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratings, overallScore, overallFeedback } = req.body;
    const appraisal = await Appraisal.findById(id);
    
    if (appraisal.reviewerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to submit this appraisal" });
    }

    appraisal.ratings = ratings;
    appraisal.overallScore = overallScore;
    appraisal.overallFeedback = overallFeedback;
    appraisal.status = 'Submitted';
    await appraisal.save();

    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit appraisal", error: error.message });
  }
};

// === GOALS ===
export const getMyGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.user.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
};

export const getEmployeeGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.params.employeeId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
};

export const createGoal = async (req, res) => {
  try {
    const newGoal = new Goal({ ...req.body, employeeId: req.user.userId });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create goal" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update goal" });
  }
};

// === KRAs ===
export const getMyKRAs = async (req, res) => {
  try {
    const kras = await KRA.find({ employeeId: req.user.userId });
    res.json(kras);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch KRAs" });
  }
};

export const getEmployeeKRAs = async (req, res) => {
  try {
    const kras = await KRA.find({ employeeId: req.params.employeeId });
    res.json(kras);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch KRAs" });
  }
};

export const createKRA = async (req, res) => {
  try {
    const newKRA = new KRA({ ...req.body, employeeId: req.user.userId });
    await newKRA.save();
    res.status(201).json(newKRA);
  } catch (error) {
    res.status(500).json({ message: "Failed to create KRA" });
  }
};

export const updateKRA = async (req, res) => {
  try {
    const updated = await KRA.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update KRA" });
  }
};

// === SKILLS ===
export const getMySkills = async (req, res) => {
  try {
    let skillDoc = await Skill.findOne({ employeeId: req.user.userId });
    if (!skillDoc) skillDoc = { skills: [] };
    res.json(skillDoc);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const getEmployeeSkills = async (req, res) => {
  try {
    let skillDoc = await Skill.findOne({ employeeId: req.params.employeeId });
    if (!skillDoc) skillDoc = { skills: [] };
    res.json(skillDoc);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const updateMySkills = async (req, res) => {
  try {
    const { skills } = req.body;
    let skillDoc = await Skill.findOne({ employeeId: req.user.userId });
    if (skillDoc) {
      skillDoc.skills = skills;
      await skillDoc.save();
    } else {
      skillDoc = await Skill.create({ employeeId: req.user.userId, skills });
    }
    res.json(skillDoc);
  } catch (error) {
    res.status(500).json({ message: "Failed to update skills" });
  }
};

// === HR DASHBOARD ===
export const getHRDashboardStats = async (req, res) => {
  try {
    const totalGoals = await Goal.countDocuments();
    const activeCycles = await AppraisalCycle.countDocuments({ status: 'Active' });
    const pendingAppraisals = await Appraisal.countDocuments({ status: 'Pending' });
    
    // Aggregation for average company score (dummy logic or actual average)
    const completedAppraisals = await Appraisal.find({ status: 'Submitted' });
    let totalScore = 0;
    let validScores = 0;
    completedAppraisals.forEach(app => {
      if (app.overallScore) {
        totalScore += app.overallScore;
        validScores++;
      }
    });
    const avgScore = validScores > 0 ? (totalScore / validScores).toFixed(1) : 0;

    res.json({
      totalGoals,
      activeCycles,
      pendingAppraisals,
      avgScore
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch HR stats" });
  }
};
