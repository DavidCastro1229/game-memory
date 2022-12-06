
const {Pool} =require('pg');


// const dataBase= new Pool({
//     connectionString:"postgres://sfnaqdgfeuxtqm:7c3c8f9ba52838051790a077ed2deeae08c5724fab0dc134b204c517c9c51e39@ec2-52-200-5-135.compute-1.amazonaws.com:5432/df2thc189bd2u9",
//     ssl: {
//         rejectUnauthorized: false
//       }
//   })
  
  const dataBase= new Pool({
      host:'localhost',
    user:'postgres',
    database:'gameMemory',
  port:'5432',
  password:'JDGC5052001',
})
module.exports = {dataBase}
