import "express-async-errors";
import express from "express";
import ns from "node-schedule";
import { getAllUsersWorkData } from "./functions/getAllUsersWorkData.js";
import routes from "./routes.js";

const app = express();

app.use(express.json());

app.use(routes);

// ns.scheduleJob("*/10 * * * *", async () => {
ns.scheduleJob("*/10 * * * * *", async () => {
  // UPDATE EVERY 10 SECONDS - DEVELOPMENT ONLY!
  await getAllUsersWorkData();
});

const PORT = process.env.PORT;
// const PORT = 1234

app.listen(PORT, () => {
  console.log(`> 💻 AutoOgmoAPI started @ port ${process.env.PORT}`);
});
