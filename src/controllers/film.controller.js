const expressAsyncHandler = require("express-async-handler");
const md5 = require("md5");
const { ROLE } = require("../constanis");
const Film = require("../models/film.model");
const Comment = require("../models/comment.model");
const Banner = require("../models/banner.model");
const tokenService = require("../services/token.service");
const connection  = require("../db/init");
require("dotenv").config();

const createFilm = expressAsyncHandler(async (req, res) => {
  try {
    const contract = await tokenService.deploy(Date.now(), req.body.price);
    req.body.contractAddress = contract["contract_address"];
    req.body.txid = contract["transaction_hash"];
    const flim = await Film.create(req.body, { raw: true });

    return res.json(flim);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllFilm = expressAsyncHandler(async (req, res) => {
  try {
    const flims = await Film.findAll({ include: Banner });

    return res.json(flims);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const deleteFilm = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Film.destroy({ where: { id } });
    await Comment.destroy({ where: { filmId: id } });

    return res.json(del);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});
const updateFilm = expressAsyncHandler(async (req, res) => {
  try {
    const film = await Film.update(
      { ...req.body },
      { where: { id: req.params.id } }
    );

    return res.json(film);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const detailFilm= expressAsyncHandler(async (req, res)=> {
  try {
    const {id} =req.query
    const detail= await Film.findAll({id: id})
    const [rows]= await connection.query("SELECT cinemas.cinemaName, clusters.id, clusters.ClusterName, clusters.address, clusters.img FROM cinemas INNER JOIN films ON films.CinemaId = cinemas.id INNER JOIN clusters ON clusters.id = cinemas.clusterId")
    console.log(rows)
    return res.status(200).json({data: detail[0], cluster: rows})
  } catch (error) {
    return res.status(404).json(error.message);
  }
})

module.exports = {
  createFilm,
  getAllFilm,
  deleteFilm,
  updateFilm,
  detailFilm
};
