const catchAsync = require("../utils/catchAsync");
const { User, Lesson, Course, Video } = require("../models/index");
const cloudinary = require('cloudinary').v2;
exports.getIndexAddVideo = catchAsync(async (req, res, next) => {
  const { idCourse } = req.params;
  const user = await User.findById(req.user.id).lean();
  const lessons = await Lesson.find({
    idCourse: idCourse,
  })
    .populate({
      path: "idCourse",
      match: {
        instructors: req.user.id,
      },
      select: "instructors",
    })
    .lean();
  const course = await Course.findById({
    _id: idCourse,
    instructors: req.user.id,
  });
  if (!lessons || !course) {
    res.redirect("/profile");
    return;
  }
  res.render("instructors/add-video", {
    user,
    layout: false,
    lessons,
    idCourse,
  });
});

exports.postAddVideo = catchAsync(async (req, res, next) => {
  const { idCourse } = req.params;
  const lessons = await Lesson.findById(req.body.idLesson);
  const course = await Course.findOne({
    _id: idCourse,
    instructors: req.user.id,
  });
  if (!lessons || !course) {
    res.redirect("/profile");
    return;
  }
  req.body.isLooked = req.body.isLooked === "true" ? true : false;

  const cloudinaryResponse = await cloudinary.uploader.upload(`${req.file.path}`,{
    resource_type:'video'
  })
  req.body.pathUrl = cloudinaryResponse.url
  await Video.create(req.body);
  res.redirect("/profile");
});
