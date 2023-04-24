const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const User = require("../models/User.model")
const Event = require("../models/Event.model")



router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
   })

router.post("/main", isLoggedIn, (req, res, next) => {
   const {  email, intrests, about, termsAccepted } = req.body
   const userId = req.session.user._id

   User.findByIdAndUpdate(userId, {  email, intrests, about, termsAccepted }, { new: true })
   .then(currUser => {
    res.redirect("main")
   })
  
})

router.get('/create-event', isLoggedIn, (reg, res, next) => {
  res.render('create-event')
})

router.post("/my-events", (req, res, next) => {
  const organizer = req.session.user._id
  const { title, location, date, time, description, maxParticipants } = req.body

  Event.create({ organizer, title, location, date, time, description, maxParticipants })
    .then(newEvent => 
      res.render("my-events")
    )
})


router.get('/my-events', isLoggedIn, (req, res, next) => {
  const organizer = req.session.user._id
  Event.find({organizer})
  .then(eventsFromDB => {
    console.log(eventsFromDB)
  res.render('my-events', {events: eventsFromDB} ) } )
})
    



module.exports = router;
