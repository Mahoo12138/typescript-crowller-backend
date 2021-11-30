
export enum Method {
  get = "get",
  post = "post",
}

const getRequestDecorator = (method: Method) => {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", method, target, key);
    };
  };
};

export const get = getRequestDecorator(Method.get);
export const post = getRequestDecorator(Method.post);