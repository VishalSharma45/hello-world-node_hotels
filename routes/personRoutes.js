const express = require("express");
const Person = require("../models/Person");
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('../jwt');

router.post("/signup", async (req, res) => {
    try {
        let person = new Person(req.body);
        let response = await person.save();

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(payload);
        const token = generateToken(payload);

        res.status(200).json({ response: response, token: token });
    } catch (error) {
        // console.log(error.errorResponse.keyValue.email + " " + error.errorResponse.errmsg)
        // error.errorResponse.errmsg = "Email already exists"
        res.status(500).json(error);
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await Person.findOne({ username });

        // If user does not exist or password not match, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate token
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        // Return token as response
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData)

        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        let people = await Person.find();
        // console.log(people);
        res.status(200).json(people);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
});
router.get("/:work", jwtAuthMiddleware, async (req, res) => {
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
});
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
});
module.exports = router;