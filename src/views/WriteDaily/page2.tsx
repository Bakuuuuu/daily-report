import { Button, Form, Input, Select, Modal } from 'antd'
import dayjs from 'dayjs'
import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import DragItem from './component/DragItem'
import {
  formOptions,
  saveTaskList,
  getTaskList,
  delTaskList,
  updateTaskList,
} from '@/request/api'

type FormList = {
  list_id: string
  date: string
  taskType: string
  projectName: string
  issue: string
  target: string
  workContent: string
}
const App: React.FC = () => {
  const [formData, setFormData] = useState({
    list_id: '',
    date: '',
    taskType: '',
    projectName: '',
    issue: '',
    target: '',
    workContent: '',
  })
  type formOptionType = {
    project_name: Array<{}>
    target: Array<{}>
    task_type: Array<{}>
  }
  useEffect(() => {
    setTime(dayjs().format('YYYY-MM-DD'))
    formOptions().then((res) => {
      let obj = res.data as formOptionType
      Object.keys(formOption).forEach((key) => {
        formOption[key] = JSON.parse(obj[key])
      })
      setFormOption({ ...formOption })
    })
    getPageList()
  }, [])
  const getPageList = () => {
    getTaskList({ date: dayjs().format('YYYY-MM-DD') }).then((res) => {
      if (res.code === 200) {
        setListContent(res.data)
      }
    })
  }
  const [form] = Form.useForm()
  const [time, setTime] = useState('')
  const [formOption, setFormOption] = useState({
    project_name: [],
    target: [],
    task_type: [],
  })
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = listContent[dragIndex]
    setListContent(
      update(listContent, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedItem],
        ],
      })
    )
  }
  const [listContent, setListContent] = useState<FormList[]>([])
  const onFinish = (values: any) => {
    if (!values.target) {
      values.target = ''
    }
    values.date = dayjs().format('YYYY-MM-DD')
    if (formData.list_id) {
      values.list_id = formData.list_id
      updateTaskList(values).then((res) => {
        if (res.code === 200) {
          getPageList()
        }
      })
    } else {
      values.list_id = dayjs().format('hhmmss')
      saveTaskList(values).then((res) => {
        if (res.code === 200) {
          getPageList()
        }
      })
    }
    form.resetFields()
    formData.taskType = ''
    formData.list_id = ''
    const obj = JSON.parse(JSON.stringify(formData))
    setFormData(obj)
    console.log('Success:', values)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const handleChange = (value: string) => {
    formData.taskType = value
    formData.target = ''
    form.setFieldValue('target', '')
    const obj = JSON.parse(JSON.stringify(formData))
    setFormData(obj)
  }
  const edit = (value: FormList) => {
    Object.keys(value).forEach((i) => {
      form.setFieldValue(i, value[i])
      formData[i] = value[i]
    })
    const obj = JSON.parse(JSON.stringify(formData))
    setFormData(obj)
  }
  const copy = (value: FormList) => {
    Object.keys(value).forEach((i) => {
      if (i !== 'list_id') {
        form.setFieldValue(i, value[i])
        formData[i] = value[i]
      }
    })
    formData.list_id = ''
    const obj = JSON.parse(JSON.stringify(formData))
    setFormData(obj)
  }
  const del = (value: FormList) => {
    Modal.confirm({
      title: '删除任务',
      content: '是否确认删除该条任务',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        return new Promise((resolve, reject) => {
          delTaskList({ list_id: value.list_id }).then((res) => {
            if (res.code === 200) {
              getPageList()
            }
            return resolve('')
          })
        }).catch(() => console.log('出错!'))
      },
    })
  }
  return (
    <div className="home" style={{ height: '100%', padding: '10px' }}>
      <div
        className="container"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div className="left_container" style={{ width: '50%' }}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="任务类型" name="taskType" shouldUpdate>
              <Select
                onChange={handleChange}
                allowClear
                options={formOption.task_type}
              />
            </Form.Item>
            <Form.Item label="项目名称" name="projectName" shouldUpdate>
              <Select allowClear options={formOption.project_name} />
            </Form.Item>
            <Form.Item label="ISSUE 号" name="issue">
              <Input />
            </Form.Item>
            {formData.taskType === '支持' && (
              <Form.Item label="支持对象" name="target">
                <Select
                  onChange={(e) => {
                    formData.target = e
                    setFormData(formData)
                  }}
                  allowClear
                  options={formOption.target}
                />
              </Form.Item>
            )}
            <Form.Item
              label="工作内容"
              name="workContent"
              rules={[{ required: true, message: '请填写工作内容！' }]}
            >
              <Input.TextArea rows={8} placeholder="请输入工作内容" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: '20px' }}
              >
                添加
              </Button>
              <Button
                type="default"
                htmlType="reset"
                onClick={() => {
                  setFormData({
                    date: '',
                    list_id: '',
                    taskType: '',
                    projectName: '',
                    issue: '',
                    target: '',
                    workContent: '',
                  })
                }}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          className="right_container"
          style={{
            width: '50%',
            maxHeight: '660px',
            flex: 1,
            borderLeft: '2px dashed #dcdfe6',
            paddingLeft: '20px',
            overflowY: 'scroll',
          }}
        >
          <div style={{ fontSize: '20px' }}>{time}</div>
          {listContent.length === 0 && (
            <div style={{ fontSize: '15px', color: '#ccc' }}>
              新的一天，开始今天的工作吧~
            </div>
          )}
          <DndProvider backend={HTML5Backend}>
            {listContent.map((item, index) => (
              <DragItem
                key={item.list_id}
                id={Number(item.list_id)}
                index={index}
                text={item}
                moveItem={moveItem}
                del={del}
                edit={edit}
                copy={copy}
              />
            ))}
          </DndProvider>
        </div>
      </div>
    </div>
  )
}
export default App
