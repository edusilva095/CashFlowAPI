const { Router } = require("express");
const controller = require("../controllers/controller");

const routesApi = new Router();

routesApi.route("/reset").post(controller.reset);

routesApi.route("/balance/:account_id").get(controller.balance);

routesApi.route("/event").post(controller.event);

module.exports = routesApi;
