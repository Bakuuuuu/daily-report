import { useState, useEffect } from 'react'
import { Button, Input, Space, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import userState from '../../store/userState/index'
import showdown from 'showdown'
import { saveMd, getMd } from '@/request/api'
const { TextArea } = Input
function About() {
  const { userInfo, num } = useSelector((state: RootState) => {
    return {
      userInfo: state.handleUser.userInfo,
      num: state.handleNum.num,
    }
  })
  const [showInput, setShowInput] = useState(true)
  const [text, setText] = useState('')
  useEffect(() => {
    getMd().then((res) => {
      if (res.code === 200) {
        setText(res.data.md_text)
      }
    })
  }, [])
  const converter = new showdown.Converter()
  const permission = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string).permission
    : ''
  function MyComponent() {
    const htmlText = converter.makeHtml(text)
    return (
      <div
        style={{
          width: '100%',
          height: '630px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
        }}
        dangerouslySetInnerHTML={{ __html: htmlText }}
      ></div>
    )
  }
  const dispatch = useDispatch()
  const changeNum = () => {
    // dispatch(userState.asyncActions.asyncLogin)
    dispatch({ type: 'add', value: 10 })
  }
  const save = () => {
    saveMd({ md_text: text }).then((res) => {
      if (res.code === 200) {
        message.success('保存成功！')
      }
    })
  }
  return (
    <div className="home">
      <div style={{ width: '100%', height: 'calc(100% - 50px)' }}>
        {showInput && permission === 'admin' ? (
          <div>
            <TextArea
              value={text}
              placeholder="请输入内容"
              rows={28}
              onChange={(e) => {
                setText(e.target.value)
              }}
            />
          </div>
        ) : (
          MyComponent()
        )}
      </div>
      {permission === 'admin' ? (
        <div style={{ float: 'right', margin: '10px 0 0 0 ' }}>
          <Space>
            <Button
              type="primary"
              onClick={(e) => {
                setShowInput(!showInput)
              }}
            >
              {showInput ? '预览' : '编辑'}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                save()
              }}
            >
              提交
            </Button>
          </Space>
        </div>
      ) : null}
    </div>
  )
}

export default About
