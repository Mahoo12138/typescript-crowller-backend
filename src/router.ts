import { NextFunction, Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import Analyzer from "./utils/analyzer";
import Crowller from "./utils/crowller";
import { getResponseData } from "./utils/result";

const router = Router();

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录"));
  }
};

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

router.get("/data", checkLogin, (req, res) => {
  const analyzer = Analyzer.getInstance();
  new Crowller(analyzer);
  res.json(getResponseData(true));
});

router.get("/show", checkLogin, (req, res) => {
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf-8");
    res.send(JSON.parse(result));
  } catch (e) {
    res.json(getResponseData(null, "数据不存在"));
  }
});

router.post("/login", (req, res) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.json(getResponseData(true, "已经登陆过"));
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
      res.json(getResponseData(true, "登陆成功"));
    } else {
      res.json(getResponseData(false, "登陆失败"));
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
