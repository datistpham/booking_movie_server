const { Router } = require("express");
const { ROLE } = require("../constanis");
const {
  register,
  login,
  getAllUser,
  deleteUser,
  updateUser,
  charge,
  chargeHistory,
  buyHistory,
} = require("../controllers/user.controller");

const authorize = require("../middlewares/auth.middleware");

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.delete("/delete/:id", deleteUser);

route.get("/getAllUser", getAllUser);
route.post("/update", updateUser);
route.post("/charge", charge);
route.post("/chargeHistory", chargeHistory);
route.post("/buyHistory", buyHistory);

module.exports = route;
