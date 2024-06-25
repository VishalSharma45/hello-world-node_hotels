const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let menus = await MenuItem.find();
        res.status(200).json({ menus });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
router.post("/", async (req, res) => {
    try {
        let menuItem = new MenuItem(req.body);
        let result = await menuItem.save();
        res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
router.get("/:taste", async (req, res) => {
    try {
        let taste = req.params.taste;
        let response = await MenuItem.find({ taste });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ eror: "Internal server error" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        let menuId = req.params.id;
        let updatedMenuData = req.body;

        let response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
            new: true, // Return the updated document
            runValidators: true, // Run mongoose validation
        });

        if (!response) {
            return res.status(404).json({ error: "Menu not found" });
        }
        res.status(200).json({ message: "Menu updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
});
router.delete("/:id", async (req, res) => {
    try {
        let menuId = req.params.id;
        let response = await MenuItem.findByIdAndDelete({ _id: menuId });
        if (!response) {
            return res.status(404).json({ error: "Menu not found" });
        }
        res.status(200).json({ message: "Menu deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;