const expressAsyncHandler = require("express-async-handler");
const connection = require("../db/init");
const Cinema = require("../models/Cinema.model");
// const { associations } = require("../models/rom.model");
const Room = require("../models/rom.model");

const createRoom = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Room.create(req.body);
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllRoomByCinema = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Room.findAll({ where: { cinemaId: id } });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllRoom = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Room.findAll({ include: Cinema });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const deleteRoom = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Room.destroy({ where: { id } });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getRoomByCinema= expressAsyncHandler(async (req, res)=> {
  try {
    let roomChosen
    const {idCinema, idFilm}= req.params
    const [rows]= await connection.execute("SELECT rooms.id, rooms.seat, rooms.seated, rooms.address, rooms.RoomName FROM rooms INNER JOIN cinemas ON rooms.cinemaId = cinemas.id WHERE rooms.cinemaId= ?", [idCinema || ""])
    roomChosen= rows?.find(item=> parseInt(item?.seated) < parseInt(item?.seat)) || [{seat: 0}]
    if(roomChosen.seat === undefined) {
      console.log(123456789)
      const [updateRoom]= await connection.execute("UPDATE rooms SET cinemaId= ? WHERE cinemaId IS NULL LIMIT 1", [idCinema])
      const [rows2]= await connection.execute("SELECT rooms.id, rooms.seat, rooms.seated, rooms.address, rooms.RoomName FROM rooms INNER JOIN cinemas ON rooms.cinemaId = cinemas.id WHERE rooms.cinemaId= ?", [idCinema || ""])
      const roomChosen2= rows2?.find(item=> parseInt(item?.seated) < parseInt(item?.seat)) || [{seat: 0}]
      roomChosen= roomChosen2
      console.log("roomChosen2", roomChosen2)
    }
    else {
      console.log(1234567)
    }
    const [seated]= await connection.execute("SELECT seatIndex FROM books WHERE id_room= ?", [roomChosen?.id || ""])
    return res.status(200).json({roomChosen: roomChosen, seated: seated, rows})
  } catch (error) {
    return res.status(404).json(error.message)
    
  }
})

const detailRoom= expressAsyncHandler(async( req, res)=> {
  try {
    const {id}= req.params
    const [detailRoom]= await connection.execute("SELECT rooms.id, rooms.seat, rooms.address, rooms.RoomName, cinemas.cinemaName, rooms.cinemaId FROM rooms INNER JOIN cinemas ON cinemas.id = rooms.cinemaId WHERE rooms.id= ?", [id])
    return res.status(200).json(detailRoom[0])
  } catch (error) {
    return res.status(404).json(error.message)
  }
})

const updateRoom= expressAsyncHandler(async (req, res)=> {
  try {
    const cinema = await Room.update(
      { ...req.body },
      { where: { id: req.params.id } }
    );

    return res.json(cinema);
  } catch (error) {
    return res.status(404).json(error.message);
  }
})
module.exports = {
  createRoom,
  deleteRoom,
  getAllRoomByCinema,
  getAllRoom,
  getRoomByCinema,
  detailRoom,
  updateRoom
};
