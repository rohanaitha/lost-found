import Report from "../model/report.js";

// Create new report
export const createReport = async (req, res) => {
  try {
    const { reportType, itemName, description, date, location, image } =
      req.body;

    // Validate required fields
    if (!reportType || !itemName || !date || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReport = await Report.create({
      reportType,
      itemName,
      description,
      date,
      location,
      imageUrl: image || "",
    });

    res
      .status(201)
      .json({ message: "Report submitted successfully", report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit report" });
  }
};
