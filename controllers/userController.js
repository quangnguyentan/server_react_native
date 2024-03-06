const asyncHandler = require("express-async-handler");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const {
  generateAccesToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const product = require("../models/product");
const makeToken = require("uniqid");
const { response } = require("express");
// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstname, lastname } = req.body;
//   if (!email || !password || !firstname || !lastname) {
//     return res.status(400).json({
//       success: false,
//       mes: "Missing input",
//     });
//   }
//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Error("Email has been already");
//   } else {
//     const newUser = await User.create(req.body);
//     return res.json({
//       success: newUser ? true : false,
//       mes: newUser ? "Register is successfully" : "Register is wrong",
//     });
//   }
// });
// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstname, lastname, mobile } = req.body;
//   if (!email || !password || !firstname || !lastname || !mobile) {
//     return res.status(400).json({
//       success: false,
//       mes: "Missing input",
//     });
//   }
//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Error("Email has been already");
//   } else {
//     const token = makeToken();
//     // res.cookie(
//     //   "dataregister",
//     //   { ...req.body, token },
//     //   {
//     //     httpOnly: true,
//     //     maxAge: 15 * 60 * 1000,
//     //   }
//     // );

//     // const html = `
//     // Xin click vào link dưới đây để hoàn tất quá trình đăng ký.Link sẽ hết hạn sau 15 phút kể từ bây giờ <a href = "${process.env.URL_SERVER}/api/user/finalregister/${token}">Click here</a> `;
//     // cách 2 đăng kí và lưu cookie dưới db
//     const emailEdit = btoa(email) + "@" + token;
//     const newUser = await User.create({
//       email: emailEdit,
//       password,
//       firstname,
//       lastname,
//       mobile,
//     });

//     if (newUser) {
//       const html = `<h2>Register Code:</h2><br/><blockquote>${token}</blockquote>`;
//       await sendMail({
//         email,
//         html,
//         subject: "Confirm register password Digital Word ",
//       });
//     }
//     setTimeout(async () => {
//       await User.deleteOne({ email: emailEdit });
//     }, [300000]);
//     return res.json({
//       success: newUser ? true : false,
//       mes: newUser ? "Please check your email" : "Please, Try again!",
//     });
//   }
// });
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  console.log(email, password, firstname, lastname, mobile);
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("Email has been already");
  } else {
    const newUser = await User.create({
      email,
      password,
      firstname,
      lastname,
      mobile,
    });
    return res.json({
      success: newUser ? true : false,
      mess: newUser ? "Created an accounnt " : "Please, Try again!",
    });
  }
});
const finalRegister = asyncHandler(async (req, res) => {
  // const cookie = req.cookies;

  const { token } = req.params;
  const notActiveEmail = await User.findOne({
    email: new RegExp(`${token}`),
  });
  if (notActiveEmail) {
    notActiveEmail.email = atob(notActiveEmail?.email?.split("@")[0]);
    notActiveEmail.save();
  }
  return res.json({
    success: notActiveEmail ? true : false,
    mess: notActiveEmail
      ? "Register is successfully. Please, Go Login"
      : "It's wrong!!",
  });
  // if (!cookie || cookie?.dataregister?.token !== token) {
  //   res.clearCookie("dataregister");
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  // }
  // const newUser = await User.create({
  //   email: cookie?.dataregister.email,
  //   password: cookie?.dataregister.password,
  //   mobile: cookie?.dataregister.mobile,
  //   firstname: cookie?.dataregister.firstname,
  //   lastname: cookie?.dataregister.lastname,
  // });
  // res.clearCookie("dataregister");
  // if (newUser)
  //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  // else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mess: "Missing input",
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrecPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccesToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(
      response._id,
      { newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, accessToken, userData });
  } else {
    throw new Error("Invalid credentials");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select(
    "-refreshToken -password -role  "
  );
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : " User not found",
  });
});
const refreshAcessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie && !cookie.refreshToken) throw new Error("No refresh token");
  const rs = jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET
    // async (err, decode) => {
    //   if (err) throw new Error("Invalid refresh token");
    //   const response = await User.findOne({
    //     id: decode._id,
    //     refreshToken: cookie.refreshToken,
    //   });
    //   return response.status(200).json({
    //     success: response ? true : false,
    //     newAccessToken: response
    //       ? generateAccesToken(response._id, response.role)
    //       : "Refresh token not matched",
    //   });
    // }
  );
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccesToken(response._id, response.role)
      : "Refresh token not matched",
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) throw new Error("No refresh token ");
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mess: "Logout ok",
  });
});
const fogotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();
  const html = ` 
    Xin click vào link dưới đây để thay đổi mật khẩu của bạn.Link sẽ hết hạn sau 15 phút kể từ bây giờ <a href = "https://192.168.3.112:5000/${resetToken}">Click here</a> 
  `;
  const data = {
    email,
    html,
    subject: "Forgot password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs.response?.includes("OK") ? true : false,
    mess: rs.response?.includes("OK")
      ? "Please, check your email"
      : "Had an error, Please try again",
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // console.log(passwordResetToken);
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid password reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});
const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role  ");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const body = req.body;
  if (!req.body.address) throw new Error("Missing address");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: body.address } },
    { new: true }
  ).select("-refreshToken -password -role  ");
  return res.status(200).json({
    status: response ? true : false,
    updatedUserAddress: response ? response : "Cannot find address",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const body = req.body;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        {
          new: true,
        }
      );
      return res.status(200).json({
        status: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { product: pid, quantity, color } },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        status: response ? true : false,
        updatedUser: response ? response : "Cannot find user",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity, color } },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: response ? true : false,
      updatedUser: response ? response : "Cannot find user",
    });
  }
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAcessToken,
  logout,
  fogotPassword,
  resetPassword,
  getUsers,
  updateUserAddress,
  updateCart,
  finalRegister,
};
