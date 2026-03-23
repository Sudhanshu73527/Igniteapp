import Notice from "../models/Notice.js";

// ➕ Add Notice
export const addNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    const notice = new Notice({ title, description });
    await notice.save();

    res.status(201).json({ message: "Notice Added", notice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All Notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete Notice
export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};