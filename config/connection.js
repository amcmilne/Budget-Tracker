const mongoose = require("mongoose");

const connectDB = async () => {
   await mongoose.connect(process.env.MONGO_URI  , {
      useUnifiedTopology: true, 
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
   });
   console.log("db has connected");
}

module.exports = connectDB;