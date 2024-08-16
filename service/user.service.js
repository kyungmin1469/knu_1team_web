const User = require("../schema/user.schema");
// user = {email: "", nickname: "", password: ""}
const createUser = async (user) => {
  try {
    const createdUser = await User.create(user);
    console.log(createdUser);
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (email, password) => {
  const user = await User.findOne({});
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    console.log(user);
    return user;
  } catch (err) {
    return null;
  }
};

const updateUserNickname = async (email, newNickname) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null; // 사용자가 존재하지 않는 경우
    }

    user.nickname = newNickname; // 닉네임 수정
    await user.save(); // 변경 사항 저장
    return user; // 수정된 사용자 반환
  } catch (err) {
    console.log(err);
    return null; // 오류 발생 시 null 반환
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUserNickname, // 추가된 함수
};
