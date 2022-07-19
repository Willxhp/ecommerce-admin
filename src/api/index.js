import request from '@/utils'
import store from '@/store'

/**
 * 注册接口
 * @param {*} param0 {username: 用户名, password: 密码, repassword: 确认密码}
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: 'api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword,
    },
  })
}

/**
 * 登录接口
 * @param {*} param0 {username: 用户名, password: 密码}
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: 'api/login',
    method: 'POST',
    data: {
      username,
      password,
    },
  })
}

/**
 * 获取用户信息接口
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: 'my/userinfo',
  })
}

/**
 * 获取左侧菜单栏信息
 * @returns Promise对象
 */
export const getMenuListAPI = () => {
  return request({
    url: '/my/menus',
  })
}

/**
 * 更新用户信息
 * @param {*} param0 { id: 用户id, username: 用户名, nickname: 昵称, email: 邮箱, user_pic: 头像 }
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({
  id,
  username,
  nickname,
  email,
  user_pic,
}) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic,
    },
  })
}

/**
 * 更新用户头像
 * @param {*} avatar 头像base64格式字符串
 * @returns Promise对象
 */
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar,
    },
  })
}

/**
 * 更新用户密码
 * @param {*} param0 { old_pwd: 原始密码, new_pwd: 新密码, re_pwd: 确认新密码 }
 * @returns Promise对象
 */
export const updateUserPwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd,
    },
  })
}

export const getCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}