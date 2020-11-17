require('dotenv').config();
const fs = require('fs/promises');
const knex = require('knex')
const ElementServices = require('./src/element/element-services');
const CheckmarkServices = require("./src/element/checkmark-services");
const RibbonServices = require("./src/element/ribbon-services");
const 
const {memoize} = require('./utils/utils');

const db = knex({
  client:"pg",
  connection: process.env.DATABASE_URL
})

async function getStore(db){

  const [elements, checkmarks, ribbons] = await Promise.all([
    ElementServices.getElements(db),
    CheckmarkServices.getCheckmarks(db),
    RibbonServices.getRibbons(db),
  ]);
  const store = {elements,checkmarks,ribbons};
  return store;
}

const getElementStore = memoize(getStore);

(async()=>{
  const store = await getElementStore(db);

 await fs.writeFile('./elementStore.json',JSON.stringify(store));
 process.exit()
})()