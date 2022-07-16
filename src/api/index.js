import request from "@/utils";

export const postLoginAPI = () => {
  return request({
    url: 'api/reg',
    method: 'POST',
    data: {
      username: 'Willxhp',
      password: '123456789',
      repassword: '123456789'
    }
  })
}