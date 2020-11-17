const express = require("express");
const ElementServices = require("./element-services");
const CheckmarkServices = require("./checkmark-services");
const RibbonServices = require("./ribbon-services");
const {memoize} = require('../../utils/utils');

const ElementRouter = express.Router();

// The bank of elements will change once per season at the most.
// Memoizing the results from the database to improve response time.


async function getStore(db){

  const [elements, checkmarks, ribbons] = await Promise.all([
    ElementServices.getElements(db),
    CheckmarkServices.getCheckmarks(db),
    RibbonServices.getRibbons(db),
  ]);
  const store = {elements,checkmarks,ribbons};
  return store;
}

const getElementStore = memoize(getStore)

ElementRouter.route("/").get(async (req, res) => {
  const db = req.app.get("db");
  const store = await getElementStore(db);
  res.json(store);
});

module.exports = ElementRouter;
