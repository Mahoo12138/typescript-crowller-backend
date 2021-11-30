import fs from "fs";
import path from "path";
import { Response, Request, NextFunction } from "express";

import Analyzer from "../utils/analyzer";
import Crowller from "../utils/crowller";
import { getResponseData } from "../utils/result";
import { controller, get, use } from "../decorator";

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录"));
  }
};

const test = (req: Request, res: Response, next: NextFunction) => {
  console.log("test middleware");
  next();
};

@controller
class CrowllerController {
  @get("/api/data")
  @use(checkLogin)
  data(req: Request, res: Response) {
    const analyzer = Analyzer.getInstance();
    new Crowller(analyzer);
    res.json(getResponseData(true));
  }

  @get("/api/show")
  @use(test)
  @use(checkLogin)
  show(req: Request, res: Response) {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.send(JSON.parse(result));
    } catch (e) {
      res.json(getResponseData(null, "数据不存在"));
    }
  }
}
