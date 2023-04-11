interface captchaApi {
  msg: string;
  img: string;
  code: number;
  captchaEnabled: boolean;
  uuid: string;
}
interface loginApi {
  username: string,
  password: string,
  // code:string,
  // uuid:string,
}
interface LoginReq {
  msg: string,
  code: number,
  data?: object
  token?: string,
}
interface GetLoginUrl {
  msg: string,
  code: number,
  data: {
    url: string
  }
}
interface commonReq {
  msg: string,
  code: number,
  data?: object | Array
}