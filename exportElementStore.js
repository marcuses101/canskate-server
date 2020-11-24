require('dotenv').config();
const fs = require('fs/promises');
const knex = require('knex')
const ElementServices = require('./src/element/element-services');
const CheckmarkServices = require("./src/element/checkmark-services");
const RibbonServices = require("./src/element/ribbon-services");
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


(async()=>{
  const store = await getStore(db)

 await fs.writeFile('./elementStore.json',JSON.stringify(store));
 process.exit()
})()