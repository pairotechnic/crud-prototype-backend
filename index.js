// Make sure you run this command in the crud-prototype/backend folder : npm install dotenv mysql2

import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';

dotenv.config();
// dotenv.config({ path: path.resolve('../.env') });
// dotenv.config({ path: path.resolve('/.env') }); // This doesn't work, just use dotenv.config();

// console.log(process.env.DATABASE_URL);

const PORT = process.env.PORT;
console.log("PORT value received from .env : " + PORT)
// const PORT = process.env.NEXT_PUBLIC_PORT;


const app = express();

    // app.use(cors());
    // app.use(express.json());

const db = await mysql.createConnection(process.env.DATABASE_URL);

app.use("/", (req, res) => { // to be commented
  res.json({ message : "Hello from Express App" });
});

app.get('/planetscaletest', (req, res) => { // working with planetscale
  res.json({msq : 'PlanetScale testing'})
})

app.get('/characters', async (req, res) => { // working with planetscale
  const sql = "SELECT * FROM users";
  const [rows] = await db.query(sql);
  res.send(rows);
})

app.get('/characters', async (req, res) => { // working with planetscale
  let status = 200;
  let retVal = {};

  try {
    const sql = "SELECT * FROM users";
    const [rows] = await db.query(sql);
    retVal.data = rows;
    // res.send(rows);
    // res.status(status).res.json(retVal);
  }catch(err){
    console.error(err)
    status = 500;
    retVal.message = "Something went wrong";
  }finally{
    res.status(status).json(retVal);

  }
})

app.get('/', async (req, res) => { 
  // const sql = "SELECT * FROM users";
  // db.query(sql, (err, data) => {
  //   if(err) return res.json(err);
  //   else return res.json(data);
  // })

  let status = 200;
  let retVal = {};

  try{
    const sql = "SELECT * FROM users"; // working with planetscale
    const [rows] = await db.query(sql);
    retVal = rows;
    // res.send(rows);
  } catch(err){
    console.error(err)
    status = 500;
    retVal.message = "Something went wrong";
  }finally{
    res.status(status).json(retVal); 
  }
})

app.post('/Create', async (req, res) => {
  const sql = " INSERT INTO users (`name`, `phone`, `email`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.phone,
    req.body.email
  ]
  db.query(sql, [values], (err, data) => {
    if(err) return res.json(err)
    else return res.json("Created new user")
  })
})

app.get('/Update/:id', async (req, res) => {
  const id = req.params.id;
  const sql = " SELECT * FROM users WHERE id = ?";
  const [rows] = await db.query(sql, [id]);

  if (!rows[0]){
    return res.json({msg : "Couldn't find the user"})
  }

  res.json(rows[0])

  // const values = [
  //   req.body.name,
  //   req.body.phone,
  //   req.body.email
  // ]
  // db.query(sql, [id], (err, data) => {
  //   if(err) return res.json(err)
  //   else return res.json(data)
  // })
})

app.put('/Update/:id', (req, res) => {
  const sql = " UPDATE users SET `name` = ?, `phone` = ?, `email` = ? WHERE id = ?";
  const id = req.params.id;
  const values = [
    req.body.name,
    req.body.phone,
    req.body.email
  ]
  db.query(sql, [...values, id], (err, data) => {
    if(err) return res.json(err)
    else return res.json(`Updated user ${id}`)
  })
})

app.delete('/Delete/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  const id = req.params.id;
  
  db.query(sql, [id], (err, data) => {
    if(err) return res.json(err)
    else return res.json(`Deleted user ${id}`)
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})