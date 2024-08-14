const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../service/user.service");
const userController = require("express").Router();
const jwt = require("jsonwebtoken");

userController.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      isVerify: false,
      result: false,
      message: "(!)로그인 정보가 올바르지 않습니다.",
    });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      isVerify: false,
      result: false,
      message: "(!)회원 정보가 없습니다.",
    });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({
      isVerify: false,
      result: false,
      message: "(!)비밀번호가 틀렸습니다.",
    });
  }

  const token = jwt.sign(
    { email: user.email, nickname: user.nickname },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    isVerify: true,
    result: true,
    message: "로그인 성공",
    token,
  });
});

userController.post("/", async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email.includes("@")) {
    return res.status(400).json({
      isVerify: false,
      isError: true,
      message: "잘못된 email 입니다.",
    });
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      isVerify: false,
      isError: true,
      message: "잘못된 비밀번호 형식입니다.",
    });
  }

  if (nickname.length < 2) {
    return res.status(400).json({
      isVerify: false,
      isError: true,
      message: "잘못된 이름 형식입니다.",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = {
    email,
    nickname,
    password: hashedPassword,
  };

  try {
    await createUser(user);
    return res.status(201).json({
      isVerify: true,
      result: true,
      message: "회원가입 성공",
    });
  } catch (err) {
    return res.status(500).json({
      isVerify: false,
      result: false,
      message: "회원가입 중 오류가 발생했습니다.",
    });
  }
});

module.exports = userController;
