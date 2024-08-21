const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// const DB = process.env.DATABASE;

mongoose.connect(DB).then((con) => {
  console.log(`DB Connection Successful`);
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on localhost:${port}...`));
// DATABASE=mongodb+srv://vinay:<PASSWORD>@cluster0.zwjwhbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
