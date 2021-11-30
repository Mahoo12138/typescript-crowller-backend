import { RequestHandler } from 'express';
import router from "../router";

import { Method } from "./request";

export function controller(target: any) {
  // 类构造器拿到的是构造函数
  for (let key in target.prototype) {
    // console.log("meatdata", Reflect.getMetadata("path", target.prototype, key));
    const path = Reflect.getMetadata("path", target.prototype, key);
    const method: Method = Reflect.getMetadata("method", target.prototype, key);
    const middlewares:RequestHandler[] = Reflect.getMetadata("middlewares", target.prototype, key);
    const hander = target.prototype[key];
    if (path && method) {
      if (middlewares && middlewares.length) {
        router[method](path, ...middlewares, hander);
      } else {
        router[method](path, hander);
      }
    }
  }
}
