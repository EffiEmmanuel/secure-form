const asyncHandler = require('express-async-handler');
const Goal = require('../models/goal');
const User = require('../models/user');

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user: req.user.id});
    res.json(goals);
});

const setGoal = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        throw new Error;
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal) {
        throw new Error;
    }

    const user = await User.findById(res.user.id);

    // Check for user
    if(!user) {
        res.status(401);
        throw new Error('User not found');
    }


    if(goal.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new:true});

    console.log(updatedGoal);
    res.status(200).json(updatedGoal);
});

const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal) {
        throw new Error;
    }

    const user = await User.findById(res.user.id);

    // Check for user
    if(!user) {
        res.status(401);
        throw new Error('User not found');
    }

    if(goal.user !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    goal.remove();

    res.json(req.params.id);
});

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}