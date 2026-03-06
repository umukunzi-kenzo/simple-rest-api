import "dotenv/config";

import connectDB from "./src/config/db.js";

import express from "express";

import userRoutes from "./src/routes/userRoutes.js";

connectDB();

const app =  express();

app.use(express.json());

app.use("/api/users",userRoutes);
   
app.get('/', (req,res) => {
  res.send("hello  dummy test!")
});

app.listen(process.env.PORT, () => {
  console.log(`Our server is running on port ${process.env.PORT} `);
})
 