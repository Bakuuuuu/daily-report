import style from './index.module.scss'
import { Input, Space, Button, message, Spin } from 'antd'
import 'antd/dist/antd.css'
import './login.less'
import { ChangeEvent, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginApi, getUserInfo, getLoginUrl } from '@/request/api'
import { useSelector, useDispatch } from 'react-redux'
import initLoginBg from './background'

const Login = () => {
  const arr = new Array<string>(10).fill('1')
  const [name, setName] = useState('admin')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  let navigateTo = useNavigate()
  const userName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const location = useLocation()
  useEffect(() => {
    initLoginBg()
    const urlArr = location.search
    let token
    let str
    let strS
    if (urlArr.indexOf('?') != -1) {
      str = urlArr.substring(1)
      strS = str.split('=')
      token = strS[1]
    }

    if (!token) {
      getLoginUrl().then((res) => {
        window.location.href = res.data.url
      })
    } else {
      localStorage.setItem('my-token', token)
      // navigateTo('/page1')
      // message.success('登陆成功，欢迎！')
    }
    window.onreset = function () {
      initLoginBg()
    }
  })
  const login = async () => {
    try {
      setLoading(true)
      const res = await loginApi({ username: name, password: password })
      setLoading(false)
      if (res.code === 200) {
        await localStorage.setItem('my-token', res.token as string)
        getUserInfo({ token: localStorage.getItem('my-token') }).then((res) => {
          if (res.code === 200) {
            dispatch({ type: 'login', value: res.data })
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            localStorage.removeItem('uuid')
            navigateTo('/home')
            message.success('登陆成功，欢迎！')
          }
        })
      } else {
        message.error(res.msg)
      }
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <Spin size={'large'} spinning={loading}>
      <div className={style.pageLogin}>
        <canvas id="canvas" style={{ display: 'block' }}></canvas>
        {/* <div className={`${style.pageLoginLayer} ${style.pageLoginLayerArea}`}>
          <ul className={style.circles}>
            {arr.map((item, index) => {
              return <li key={index} />
            })}
          </ul>
        </div>
        <div className={`${style.pageLoginLayer} ${style.pageLoginLayerTime}`}>
          {'09:11:11'}
        </div> */}
        <div className={`${style.pageLoginLayer}`}>
          <div className={`${style.loginBox} login-box`}>
            <div className={style.title}>
              <h1>日报管理系统</h1>
              <p>Strive Everyday</p>
            </div>
            {/* <div className="form">
              <Space direction="vertical" size={15} style={{ display: 'flex' }}>
                <Input placeholder="用户名" value={name} onChange={userName} />
                <Input.Password
                  placeholder="密码"
                  value={password}
                  onChange={passwordChange}
                />
                <Button
                  className="login-btn"
                  type="primary"
                  block
                  onClick={login}
                >
                  登录
                </Button>
              </Space>
            </div> */}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default Login
