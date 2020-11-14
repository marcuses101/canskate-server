const express = require("express");
const path = require("path");
const xss = require("xss");
const ElementServices = require("./element-services");
const CheckmarkServices = require("./checkmark-services");
const RibbonServices = require("./ribbon-services");

const ElementRouter = express.Router();

ElementRouter.route("/").get(async (req, res) => {
  const db = req.app.get("db");

  const [elements, checkmarks, ribbons] = await Promise.all([
    ElementServices.getElements(db),
    CheckmarkServices.getCheckmarks(db),
    RibbonServices.getRibbons(db),
  ]);
  res.json({elements,checkmarks,ribbons});
});

module.exports = ElementRouter;
