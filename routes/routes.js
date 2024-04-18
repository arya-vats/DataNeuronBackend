// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const Data = require("../models/models");

const router = express.Router();

// Add API endpoint to fetch all data
router.get("/getAll", async (req, res) => {
  try {
    const allData = await Data.find();

    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { data } = req.body;

    // Clear existing data
    await Data.deleteMany({});

    const newData = new Data({
      data: [data],
      count_add: 1,
      count_update: 1,
    });

    // Save the new document to the database
    await newData.save();

    res.status(200).json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    // Check if id is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const existingData = await Data.findById(id);

    if (!existingData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Update the value
    existingData.data[0].value = value;

    // Increment the count
    existingData.count_update += 1;

    // Save the updated document
    await existingData.save();

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add API endpoint to fetch count of data
router.get("/count", async (req, res) => {
  try {
    // Get the total count by summing up the 'count' field of all documents
    const totalCount = await Data.aggregate([
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);

    const count = totalCount.length > 0 ? totalCount[0].total : 0;

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
