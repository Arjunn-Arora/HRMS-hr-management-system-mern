import LeavePolicy from "../models/LeavePolicy.js";
import LeaveRequest from "../models/LeaveRequest.js";

export const createLeavePolicy = async (req, res) => {
  try {
    const { name, type = "Paid", totalDays, description = "" } = req.body;

    if (!name || !totalDays) {
      return res.status(400).json({ message: "Name and totalDays are required" });
    }

    const policy = await LeavePolicy.create({ name, type, totalDays, description });
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: "Error creating policy", error: err.message });
  }
};


export const getAllLeavePolicies = async (req, res) => {
  try {
    const policies = await LeavePolicy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching policies", error: err.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { policyId, startDate, endDate, reason } = req.body;

    const leave = await LeaveRequest.create({
      employeeId: req.user.userId,
      leavePolicy: policyId,  // ✅ map correctly
      startDate,
      endDate,
      reason
    });

    res.status(201).json(leave);
  } catch (err) {
    console.error("Apply Leave Error:", err);
    res.status(500).json({ message: "Error applying leave", error: err.message });
  }
};


export const getLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find()
      .populate("employeeId", "name email")
      .populate("leavePolicy", "name");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

export const getMyLeaveBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const policies = await LeavePolicy.find();
    const leaves = await LeaveRequest.find({ employee: userId, status: "Approved" });

    const balance = policies.map(policy => {
      const used = leaves.filter(l => l.policy.toString() === policy._id.toString()).length;
      return {
        policyName: policy.name,
        allowed: policy.allowedDays,
        used,
        remaining: policy.allowedDays - used
      };
    });

    res.json(balance);
  } catch (err) {
    res.status(500).json({ message: "Failed to get leave balance", error: err.message });
  }
};

export const getMyLeaveHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await LeaveRequest.find({ employee: userId }).populate("policy", "name");
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};

export const filterLeaves = async (req, res) => {
  const { status, policy, employee, from, to } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (policy) filter.policy = policy;
  if (employee) filter.employee = employee;
  if (from && to) filter.fromDate = { $gte: new Date(from), $lte: new Date(to) };

  const results = await Leave.find(filter)
    .populate("employee", "name email")
    .populate("policy", "name");
  res.json(results);
};

export const getLeaveStats = async (req, res) => {
  try {
    const data = await LeaveRequest.aggregate([
      { $match: { status: "Approved" } },
      {
        $group: {
          _id: "$leavePolicy",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "leavepolicies", // collection name
          localField: "_id",
          foreignField: "_id",
          as: "policyInfo"
        }
      },
      {
        $unwind: "$policyInfo"
      },
      {
        $project: {
          _id: 0,
          type: "$policyInfo.name",
          count: 1
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};


export const updateLeavePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, totalDays } = req.body;

    if (!name || !totalDays) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await LeavePolicy.findByIdAndUpdate(
      id,
      { name, totalDays },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Leave policy not found" });
    }

    res.json({ message: "Leave policy updated", policy: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update policy", error: error.message });
  }
};

export const deleteLeavePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LeavePolicy.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Leave policy not found" });
    }

    res.json({ message: "Leave policy deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete policy", error: error.message });
  }
};

