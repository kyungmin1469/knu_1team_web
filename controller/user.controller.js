const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../service/user.service");
const userController = require("express").Router();
userController.post("/", async (req, res) => {
  const { email, password, nickname } = req.body;
  console.log(req.body);

  if (!email.includes("@")) {
    return res
      .status(400)
      .json({ isError: true, message: "잘못된 email 입니다." });
  }
  // 2) password 검증
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
  console.log(passwordRegex.test(password));
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({ isError: true, message: "잘못된 비밀번호 형식입니다." });
  }
  // 3) nickname 검증
  if (nickname.length < 2) {
    return res
      .status(400)
      .json({ isError: true, message: "잘못된 이름 형식입니다." });
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
    return res.status(201).json({ result: true });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ result: false });
  }
});

const verifyToken = async (req, res) => {
  const { userToken } = req.body;
  if (!userToken) {
    res.status(400).json({ message: "잘못된 접근입니다." });
  } else {
    const isVerify = jwt.verify(getToken, process.env.JWT_SECRET);
    try {
      if (isVerify) {
        return res.status(200).json({
          isVerify: true,
          email: user.email,
          nickname: user.nickname,
          redirectUrl: "../public/mypage",
        });
      } else {
        return res
          .status(400)
          .json({ isVerify: false, message: "유효하지 않은 사용자입니다." });
      }
    } catch {
      return res
        .status(500)
        .json({ isVerify: false, message: "token값이 정상적이지 않습니다." });
    }
  }
};

module.exports = userController;
