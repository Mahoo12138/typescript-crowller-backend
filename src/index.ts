import express from "express";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";

import "./controller/LoginController";
import "./controller/CrowllerController";
import router from "./router";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: ["mahoo12138"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(router);

app.listen(7000, () => {
  console.log("Server is running!");
});
