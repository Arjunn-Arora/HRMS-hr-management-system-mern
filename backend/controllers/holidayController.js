import Holiday from "../models/Holiday.js";

export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holidays", error: error.message });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const { name, date, type } = req.body;
    const holiday = new Holiday({ name, date, type });
    await holiday.save();
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: "Failed to create holiday", error: error.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ message: "Holiday deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete holiday", error: error.message });
  }
};
