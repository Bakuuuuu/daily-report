import request from './index'
export const captchaApi = (): Promise<captchaApi> => request.get('/prod-api/captchaImage')
export const loginApi = (params: loginApi): Promise<LoginReq> => request.get('/login', { params })
export const getLoginUrl = (): Promise<GetLoginUrl> => request.get('/getLoginUrl')
export const getUserInfo = (params: object): Promise<LoginReq> => request.get('/api/userInfo', { params })
export const formOptions = (): Promise<LoginReq> => request.get('/api/formOptions')
export const saveTaskList = (params: object): Promise<commonReq> => request.post('/api/saveTaskList', params)
export const getTaskList = (params: object): Promise<commonReq> => request.get('/api/getTaskList', { params })
export const getTaskListByDate = (params: object): Promise<commonReq> => request.get('/api/getTaskListByDate', { params })
export const getTaskListById = (params: object): Promise<commonReq> => request.get('/api/getTaskListById', { params })
export const delTaskList = (params: object): Promise<commonReq> => request.post('/api/delTaskList', params)
export const updateTaskList = (params: object): Promise<commonReq> => request.post('/api/updateTaskList', params)
export const getUserList = (): Promise<commonReq> => request.get('/api/getUserList')
export const getWeekData = (params: object): Promise<commonReq> => request.get('/api/getWeekData', { params })
export const saveMd = (params: object): Promise<commonReq> => request.post('/api/saveMd', params)
export const getMd = (): Promise<commonReq> => request.get('/api/getMd')