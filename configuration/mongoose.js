const mongoose = require("mongoose");
// const mongo_url = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
const mongo_url = `mongodb://davisn33:123123123@cluster0-shard-00-00.jbrce.mongodb.net:27017,cluster0-shard-00-01.jbrce.mongodb.net:27017,cluster0-shard-00-02.jbrce.mongodb.net:27017/favvle?ssl=true&replicaSet=atlas-ekm1oz-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(mongo_url, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((resolve) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Can not connect to database : " + err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  mongoose.connection.close();
  process.exit(0);
});
