const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../service/user.service");
const userController = require("express").Router();

const jwt = require("jsonwebtoken");

userController.post("/signin", async (req, res) => {
  //사용자로부터 email과 password를 받음
  const email = req.body.email;
  const password = req.body.password;
  //email 혹은 password 둘 중에 하나라도 없으면(입력하지 않았으면) 튕겨낸다
  if (!email || !password) {
    return res
      .status(400)
      .json({ result: false, message: "(!)로그인 정보가 올바르지 않습니다." });
  }
  //여기까지 하면 사용자가 잘못 입력했을 때의 처리는 끝

  //email을 기준으로 DB에서 유저 데이터를 꺼내와야 함
  //DB와 express는 물리적으로 떨어져있으므로 응답이 언제 올 지 모름. 비동기로 해야하므로 await, async
  const user = await getUserByEmail(email);
  if (!user) {
    //user 정보가 없으면 회원 정보가 없다고 띄운다(404 not found와 함께)
    return res
      .status(404)
      .json({ result: false, message: "(!)회원 정보가 없습니다." });
  }
  //user | null

  //User가 실제로 있는 구간
  const isValidPassword = bcrypt.compareSync(password, user.password); //사용자가 입력한 pw를 bcrypt로 암호화되어 DB에 저장되었기 때문에 그거랑 맞는지 확인해야함.
  if (isValidPassword) {
    //token을 끼워넣기
    const token = jwt.sign(
      { email: user.email, nickname: user.nickname },
      process.env.JWT_SECRET
    );
    //사용자가 입력한 password와 user의 password가 같으면! 로그인 시킨다.
    return res
      .status(200)
      .json({ result: true, message: "로그인 성공.", token });
  } else {
    return res
      .status(400)
      .json({ result: false, message: "(!)비밀번호가 올바르지 않습니다." }); //실제 상황에서는 이런식으로 뭐가 틀렸는지 자세히 알려주지x. 해커 입장에서 뚫기 편하니까
  }
});

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
    return res.status(500).json({ result: false });
  }
});

module.exports = userController;
