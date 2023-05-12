import { useEffect } from 'react'
import { useRoutes, useLocation, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { getUserInfo } from '@/request/api'
import { useDispatch } from 'react-redux'

import router from './router'
function ToLogin() {
  const navigateTo = useNavigate()

  useEffect(() => {
    navigateTo('/login')
    message.warning('您还没有登录，请登录后再访问！')
  }, [])
  return <div></div>
}
function ToPage1() {
  const navigateTo = useNavigate()

  useEffect(() => {
    navigateTo('/writeDaily')
    message.warning('您已经登录过了！')
  }, [])
  return <div></div>
}

function BeforeRouterEnter() {
  const routerView = useRoutes(router)
  const token = localStorage.getItem('my-token')
  const location = useLocation()

  if (location.pathname !== '/login' && !token) {
    return <ToLogin />
  }
  return routerView
}
function App() {
  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('my-token')
    if (token) {
      getUserInfo({ token })
        .then((res) => {
          if (res.code === 200) {
            dispatch({ type: 'login', value: res.data })
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            localStorage.setItem('fakeToken', JSON.stringify(res.token))
            localStorage.removeItem('uuid')
            if (location.pathname === '/') {
              navigateTo('/home')
            } else if (location.pathname === '/login') {
              navigateTo('/home')
              message.success('登陆成功，欢迎！')
            } else if (location.pathname !== '/login') {
              navigateTo(location.pathname)
            }
          } else {
            navigateTo('/404')
          }
        })
        .catch((err) => {
          navigateTo('/404')
        })
    }
  }, [])

  return (
    <div className="app">
      <BeforeRouterEnter />
    </div>
  )
}

export default App
