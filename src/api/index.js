import request from '@/utils/request'

/**
 * 登录接口
 * @param {Object} param0 信息对象{username: 用户名, passwordMd5: 密码}
 * @returns Promise对象
 */
export const loginAPI = (adminLoginParam) => {
  return request({
    url: '/manage-api/v1/adminUser/login',
    method: 'POST',
    data: adminLoginParam
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

/**
 * 获取文章分类列表
 * @returns Promise对象
 */
export const getCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加文章分类列表
 * @param {*} param0 { cate_name: 分类名称, cate_alias: 分类别名 }
 * @returns Promise对象
 */
export const addCateListAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新文章分类
 * @param {*} param0 { id: 文章分类id, cate_name: 分类名称, cate_alias: 分类别名 }
 * @returns Promise对象
 */
export const updateCateListAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除文章分类
 * @param {*} id 文章分类id
 * @returns 
 */
export const deleteCateListAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 发布文章
 * @param {*} fd FormData类型的对象
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    // 如果data传入的是一个普通对象，axios会将其转换为json字符串
    // 当前接口需要传入的body参数类型是multipart/form-data，需要传入HTML5的FormData类型的对象
    data: fd
  })
}

/**
 * 获取文章列表
 * @param {*} param0 { pagenum: 当前页码数, pagesize: 当前页面需要的数据条数, cate_id: 文章分类id, state: 文章状态 }
 * @returns Promise对象
 */
export const getArtListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情
 * @param {*} id 文章id值
 * @returns Promise对象
 */
export const getArtDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章
 * @param {*} id 文章id值
 * @returns Promise对象
 */
export const deleteArtAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}