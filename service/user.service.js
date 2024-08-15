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

module.exports = {
  createUser,
  getUserByEmail,
};
