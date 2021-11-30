import { Response, Request } from "express";

import { getResponseData } from "../utils/result";
import { controller, get, post } from "../decorator";

@controller
class LoginController {
  @post("/api/login")
  login(req: Request, res: Response) {
    const { password } = req.body;
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
      res.json(getResponseData(true, "已经登陆过"));
    } else {
      if (password === "123" && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, "登陆失败"));
      }
    }
  }

  @get("/api/logout")
  logout(req: Request, res: Response) {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  @get("/api/islogin")
  isLogin(req: Request, res: Response) {
    const isLogin: boolean = !!(req.session ? req.session.login : false);
    console.log(isLogin);
    res.json(getResponseData(isLogin));
  }

  @get("/")
  home(req: Request, res: Response) {
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
  }
}
