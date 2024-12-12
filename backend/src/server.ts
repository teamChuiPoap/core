import express from "express";
import { configureMiddleware } from "./middleware/config";
import { createServer } from "http";
import { connectDB } from "./config/db";

let db: any;
(async () => {
  db = await connectDB();
})();

const app = express();

//setup middleware
configureMiddleware(app);

//setup routes
app.use("/", require("./routes/ussd-route"));
app.use("/api/advice", require("./routes/advice"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/checkups", require("./routes/checkups"));

//start server
const httpServer = createServer(app);

httpServer.listen(5000, () => {
  console.info(
    `MAISHA V1 SERVER STARTED ON`,
    httpServer.address(),
    `PID ${process.pid} \n`
  );
});
