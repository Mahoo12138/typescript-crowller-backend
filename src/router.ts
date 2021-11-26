import { Router } from "express";
import fs from "fs";
import path from "path";
import MyAnalyzer from "./utils/analyzer";
import Crowller from "./utils/crowller";

const router = Router();

router.get("/", (req, res) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`<html>
    <body>
      <a href="/data">爬取数据</a>
      <a href="/show">展示数据</a>
      <a href="/logout">退出</a>
    </body>
  </html>`);
  } else {
    res.send(`<html>
    <body>
      <form method="post" action="/login">
        <input type="password" name="password"/>
        <button>登录</button>
      </from>
    </body>
  </html>`);
  }
});

router.get("/data", (req, res) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    const analyzer = MyAnalyzer.getInstance();
    new Crowller(analyzer);
    res.send("GetData OK");
  } else {
    res.send("请先登录");
  }
});

router.get("/show", (req, res) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    try {
      const position = path.resolve(__dirname, "../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.send(JSON.parse(result));
    } catch (e) {
      res.send("尚未爬取到内容");
    }
  } else {
    res.send("请先登录");
  }
});

router.post("/login", (req, res) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send("已经登陆过");
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
      res.send("登陆成功");
    } else {
      res.send("登陆失败");
    }
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.redirect("/");
});

export default router;
