const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../service/user.service");
const userController = require("express").Router();
const jwt = require("jsonwebtoken");

userController.post("/me", async (req, res) => {
  const token = req.body.userToken; // Authorization 헤더에서 토큰 추출
  //const token = authHeader.split(" ")[1]; // Bearer 뒤의 토큰만 추출

  if (!token) {
    return res.status(401).json({
      isVerify: false,
      result: false,
      message: "토큰이 제공되지않음.",
    });
  }
  try {
    console.log("JWT_SECRET: ", process.env.JWT_SECRET);
    //const user = jwt.decode(token, { complete: true }); // {email: "", nickname: ""}
    //토큰 유효성 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    //토큰이 유효할 경우 -> 이메일, 이름 반환
    return res.status(200).json({
      isVerify: true,
      result: true,
      email: decoded.email,
      nickname: decoded.nickname,
    });
  } catch (err) {
    //토큰이 유효하지 않을 경우
    console.log("Token 유효 error", err);
    return res.status(401).json({
      isVerify: false,
      result: false,
      message: "유효하지 않음.",
    });
  }
});

userController.post("/signin", async (req, res) => {
  //사용자로부터 이메일과 패스워드를 받음.
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      isVerify: false,
      result: false,
      message: "(!)로그인 정보가 올바르지 않습니다.",
    });
  }

  //이메일을 기준으로 DB에서 유저 데이터를 꺼내와야함.
  const user = await getUserByEmail(email);
  //유저가 없다면 나가라.
  if (!user) {
    return res.status(404).json({
      isVerify: false,
      result: false,
      message: "(!)회원 정보가 없습니다.",
    });
  }

  //true or false
  //const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
  //유저가 실제 있는 구간
  const isValidPassword = bcrypt.compareSync(password, user.password);

  //만약 토큰이 없을 경우
  // if (token === undefined) {
  if (isValidPassword) {
    //Token 끼워넣기
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
  } else {
    return res.status(400).json({
      isVerify: false,
      result: false,
      message: "(!)비밀번호가 틀렸습니다.",
    });
  }
  // } else {
  //   //토크 유효성이 검사되었을 경우
  //   console.log(user.email);
  //   return res.status(200).json({ result: true, message: "로그인 성공" });
  // }
});

userController.post("/", async (req, res) => {
  const { email, password, nickname } = req.body;
  console.log(req.body);

  if (!email.includes("@")) {
    return res.status(400).json({
      isVerify: false,
      isError: true,
      message: "잘못된 email 입니다.",
    });
  }
  // 2) password 검증
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      isVeryfi: false,
      isError: true,
      message: "잘못된 비밀번호 형식입니다.",
    });
  }
  // 3) nickname 검증
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
    return res
      .status(201)
      .json({ isVerify: true, result: true, message: "회원가입 성공" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ result: false });
  }
});

const verifyToken = (req, res) => {
  const { userToken } = req.body;
  if (!userToken) {
    return res
      .status(401)
      .json({ isVerify: false, result: false, message: "잘못된 접근입니다." });
  } else {
    const isVerify = jwt.verify(userToken, process.env.JWT_SECRET);
    try {
      if (isVerify) {
        return res.status(200).json({
          isVerify: true,
          email: user.email,
          nickname: user.nickname,
          redirectUrl: "../public/mypage",
        });
      } else {
        return res.status(401).json({
          isVerify: false,
          result: false,
          message: "유효하지 않은 사용자입니다.",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ isVerify: false, message: "Token 값이 정상적이지 않습니다." });
    }
  }
};

module.exports = userController;
