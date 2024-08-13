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

module.exports = {
  createUser,
};