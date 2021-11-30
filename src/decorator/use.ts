import { RequestHandler} from "express";

export function use(middleware: RequestHandler) {
  return function (target: any, key: string) {
    const middlewares:RequestHandler[] = Reflect.getMetadata("middlewares",target, key) || [];
    middlewares.push(middleware);
    Reflect.defineMetadata("middlewares", middlewares, target, key);
  };
}