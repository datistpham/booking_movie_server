const { Router } = require("express");
const {
  createRoom,
  deleteRoom,
  getAllRoomByCinema,
  getAllRoom,
  getRoomByCinema,
} = require("../controllers/room.controller");

const route = Router();

route.post("/create", createRoom);
route.delete("/delete/:id", deleteRoom);
route.get("/cinema/:id", getAllRoomByCinema);
route.get("/", getAllRoom);
route.get("/get_room/by/cinema/:idCinema", getRoomByCinema)

module.exports = route;
