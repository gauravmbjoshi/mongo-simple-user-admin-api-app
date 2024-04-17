const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
// User Routes
router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.create({
    username,
    password,
  });
  res.json({
    message: "User created!",
  });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  // fetchinf all the courses in the database to show here
  const response = await Course.find({});
  res.json({ Courses: response });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;

  await User.updateOne(
    {
      username,
    },
    // purchased courses course id is pushed in the user data using the schima we defined priorly
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  );
  res.json({
    message: courseId,
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.headers.username,
  });
  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({
    courses: courses,
  });
});

module.exports = router;
