const express = require("express");
const Person = require("../models/Person");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let person = new Person(req.body);
        let result = await person.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error.errorResponse.keyValue.email + " " + error.errorResponse.errmsg)
        error.errorResponse.errmsg = "Email already exists"
        res.status(500).json(error.errorResponse.keyValue.email + " " + error.errorResponse.errmsg);
    }
});
router.get('/', async (req, res) => {
    try {
        let people = await Person.find();
        console.log(people);
        res.status(200).json(people);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
});
router.get("/:work", async (req, res) => {
    try {
        let role = req.params.work;
        if (role === 'chef' || role === 'manager' || role === 'waiter') {
            let response = await Person.find({ work: role });
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: "Invalid role type" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        let personId = req.params.id;
        const updatedPersonData = req.body;

        let response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true, // Return the updated document
            runValidators: true, // Run mongoose validation
        });

        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
})
router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let response = await Person.findByIdAndDelete({ _id: id });
        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }
        res.status(200).json({ message: "Person deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})
module.exports = router;