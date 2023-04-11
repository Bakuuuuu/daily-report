import { Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import userState from '../../store/userState/index'

function About() {
  const { userInfo, num } = useSelector((state: RootState) => {
    return {
      userInfo: state.handleUser.userInfo,
      num: state.handleNum.num,
    }
  })
  const dispatch = useDispatch()
  const changeNum = () => {
    // dispatch(userState.asyncActions.asyncLogin)
    dispatch({ type: 'add', value: 10 })
  }
  const logout = () => {
    localStorage.removeItem('my-token')
    localStorage.removeItem('userInfo')
    window.location.reload()
  }
  return (
    <div className="home">
      <p>这是Page1</p>
      <p>{`${JSON.stringify(userInfo)}`}</p>
      <div>{num}</div>
      <Button type="primary" onClick={changeNum}>
        按钮
      </Button>
      <br />
      <Button type="primary" onClick={logout} style={{ marginTop: 20 }}>
        退出登录
      </Button>
      <img
        style={{ display: 'block', marginTop: 20 }}
        width={'100px'}
        src={
          localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo') as string).user_pic
            : ''
        }
        alt=""
      ></img>
    </div>
  )
}

export default About
