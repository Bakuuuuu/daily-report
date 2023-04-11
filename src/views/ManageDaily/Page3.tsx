import {
  Table,
  Tooltip,
  message,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useState, useEffect, useRef } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import ExportJsonExcel from 'js-export-excel'
import dayjs from 'dayjs'
import moment from 'moment'
import './Page3.css'
import {
  getTaskList,
  formOptions,
  updateTaskList,
  delTaskList,
  saveTaskList,
  getWeekData,
} from '@/request/api'
function Home() {
  useEffect(() => {
    setDateYear(moment().weekYear())
    const firstDateInWeek = dayjs().day(1).format('YYYY-MM-DD')
    setWeekDateListMethod(firstDateInWeek, true)
    getTaskList({ date: dayjs().format('YYYY-MM-DD') }).then((res) => {
      setData(res.data)
    })
  }, [])
  useEffect(() => {
    formOptions().then((res) => {
      let obj = res.data as formOptionType
      Object.keys(formOption).forEach((key) => {
        formOption[key] = JSON.parse(obj[key])
      })
      setFormOption({ ...formOption })
    })
  }, [])

  interface dateList {
    text: string
    value: number
    activeColor: string
    subColor: string
    isActive: boolean
    transitionTime: number
    date: string
  }
  const date: dateList[] = [
    {
      text: '星期一',
      value: 1,
      activeColor: 'rgb(50, 130, 255)',
      subColor: 'rgb(211,229,253)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
    {
      text: '星期二',
      value: 2,
      activeColor: 'rgb(101, 59, 183)',
      subColor: 'rgb(223,215,238)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
    {
      text: '星期三',
      value: 3,
      activeColor: 'rgb(157, 44, 178)',
      subColor: 'rgb(231,213,237)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
    {
      text: '星期四',
      value: 4,
      activeColor: 'rgb(225, 67, 152)',
      subColor: 'rgb(243,216,231)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
    {
      text: '星期五',
      value: 5,
      activeColor: 'rgb(161, 103, 66)',
      subColor: 'rgb(235,225,216)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
    {
      text: '星期六',
      value: 6,
      activeColor: 'rgb(135, 152, 162)',
      subColor: 'rgb(233,234,236)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
    {
      text: '星期日',
      value: 0,
      activeColor: 'rgb(237, 124, 48)',
      subColor: 'rgb(248,231,213)',
      isActive: false,
      transitionTime: 0.8,
      date: '',
    },
  ]
  type FormList = {
    list_id: string
    date: string
    taskType: string
    projectName: string
    issue: string
    target: string
    workContent: string
  }
  type formOptionType = {
    project_name: Array<{}>
    target: Array<{}>
    task_type: Array<{}>
  }
  type ExportType = {
    taskType: string
    projectName: string
    issue: string
    target: string
    workContent: string
  }
  let timer: any = null
  const currentDate = dayjs().format('YYYY-MM-DD')
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [dateList, setDateList] = useState(date)
  const [lastClickTabIndex, setLastClickTabIndex] = useState(0)
  const [data, setData] = useState<DataType[]>([])
  const [dateYear, setDateYear] = useState(0)
  const [activeWeekCount, setActiveWeekCount] = useState(moment().weeks())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formOption, setFormOption] = useState({
    project_name: [],
    target: [],
    task_type: [],
  })
  const [formData, setFormData] = useState({
    list_id: '',
    date: '',
    taskType: '',
    projectName: '',
    issue: '',
    target: '',
    workContent: '',
  })
  const [submitType, setSubmitType] = useState('')
  const [weekDateList, setWeekDateList] = useState([''])
  const totalWeekCount = moment().isoWeeksInYear()
  const currentWeekCount = moment().weeks()
  const [form] = Form.useForm()

  const useUpdateEffect = (fn: Function, inputs: any[]) => {
    const didMountRef = useRef(false)
    useEffect(() => {
      if (didMountRef.current) fn()
      else didMountRef.current = true
    }, inputs)
  }
  useUpdateEffect(() => {
    const monday = moment()
      .isoWeekYear(dateYear)
      .isoWeek(activeWeekCount)
      .startOf('isoWeek')
      .format('YYYY-MM-DD')
    setWeekDateListMethod(monday)
    getTaskList({ date: monday }).then((res) => {
      setData(res.data)
    })
  }, [activeWeekCount])

  const setWeekDateListMethod = (firstDateInWeek: string, isInit = false) => {
    const weekDateList: string[] = []
    weekDateList.push(firstDateInWeek)
    for (let i = 1; i <= 6; i++) {
      const weekDate = dayjs(firstDateInWeek)
        .add(i, 'days')
        .format('YYYY-MM-DD')
      weekDateList.push(weekDate)
    }
    setWeekDateList(weekDateList)
    if (isInit) {
      dateList.forEach((item, index) => {
        item.date = weekDateList[index]
        if (item.date === currentDate) {
          item.isActive = true
          setCurrentTabIndex(index)
        }
      })
      setDateList(dateList)
    } else {
      dateList.forEach((item, index) => {
        item.date = weekDateList[index]
        if (item.date === firstDateInWeek) {
          item.isActive = true
          setCurrentTabIndex(index)
        }
      })
      const date = dateList.concat([])
      setDateList(date)
    }
  }
  const tabClickMethod = (item: dateList, index: number) => {
    if (
      !dayjs(item.date).isBefore(dayjs(currentDate)) &&
      !dayjs(item.date).isSame(dayjs(currentDate))
    ) {
      return
    }
    if (index === currentTabIndex || timer) return
    setLastClickTabIndex(currentTabIndex)
    setCurrentTabIndex(index)
    item.transitionTime = 0.8
    dateList[currentTabIndex].isActive = true
    setDateList(dateList)
    timer = setTimeout(() => {
      item.transitionTime = 0
      dateList[lastClickTabIndex].isActive = false
      timer = null
      setDateList(dateList)
    }, 800)
    getTaskList({ date: item.date }).then((res) => {
      setData(res.data)
    })
  }
  const getActiveTabDate = () => {
    let date = null
    dateList.forEach((item, i) => {
      if (i === currentTabIndex) {
        date = item.date
      }
    })
    return date
  }
  const goWeekMethod = (type: number) => {
    if (type === 1) {
      if (dateYear < moment().weekYear()) {
        if (activeWeekCount < totalWeekCount) {
          const num = activeWeekCount + 1
          setActiveWeekCount(num)
        } else {
          message.warning('最大只能到今年哦~')
        }
      } else {
        if (activeWeekCount < currentWeekCount) {
          const num = activeWeekCount + 1
          setActiveWeekCount(num)
        } else {
          const index = dateList.findIndex((i) => i.date === currentDate)
          setCurrentTabIndex(index)
          getTaskList({ date: dateList[index].date }).then((res) => {
            setData(res.data)
          })
          message.warning('最大只能到当前周哦~')
        }
      }
    } else if (type === -1) {
      if (activeWeekCount > 1) {
        const num = activeWeekCount - 1
        setActiveWeekCount(num)
      } else {
        message.warning('最小只能到今年哦~')
      }
    }
  }
  const getPageList = () => {
    getTaskList({ date: getActiveTabDate() }).then((res) => {
      if (res.code === 200) {
        setData(res.data)
      }
    })
  }
  const edit = (value: FormList) => {
    Object.keys(value).forEach((i) => {
      form.setFieldValue(i, value[i])
      formData[i] = value[i]
    })
    const obj = JSON.parse(JSON.stringify(formData))
    setFormData(obj)
    setIsModalOpen(true)
    setSubmitType('edit')
  }
  const copy = (value: FormList) => {
    Modal.confirm({
      title: '复制任务',
      content: '是否确认将该任务复制到今日',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        return new Promise((resolve, reject) => {
          value.date = dayjs().format('YYYY-MM-DD')
          value.list_id = dayjs().format('hhmmss')
          saveTaskList(value).then((res) => {
            if (res.code === 200) {
              getPageList()
            }
            return resolve('')
          })
        }).catch(() => console.log('出错!'))
      },
    })
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
  const add = () => {
    form.resetFields()
    setIsModalOpen(true)
    setSubmitType('add')
  }
  const exportData = () => {
    getWeekData({ start: weekDateList[0], end: weekDateList[6] }).then(
      (res) => {
        if (res.data.length === 0) {
          return message.error('没有数据可以导出')
        }
        if (res.code === 200) {
          const datas = res.data
          var option = { fileName: '', datas: [{}] }
          let dataTable: Array<ExportType> = []
          if (datas) {
            datas.map((item: ExportType) => {
              let obj = {
                taskType: item.taskType,
                projectName: item.projectName,
                issue: item.issue,
                target: item.target,
                workContent: item.workContent,
              }
              dataTable.push(obj)
              return dataTable
            })
          }
          option.fileName = '周报内容'
          option.datas = [
            {
              sheetData: dataTable,
              sheetName: 'sheet',
              columnWidths: [5, 5, 5, 5, 20],
              sheetFilter: [
                'taskType',
                'projectName',
                'issue',
                'target',
                'workContent',
              ],
              sheetHeader: [
                '任务类型',
                '项目名称',
                'ISSUE 号',
                '支持对象',
                '工作内容',
              ],
            },
          ]
          var toExcel = new ExportJsonExcel(option)
          toExcel.saveExcel()
        }
      }
    )
  }
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (submitType === 'edit') {
          values.list_id = formData.list_id
          updateTaskList(values).then((res) => {
            if (res.code === 200) {
              getPageList()
            }
          })
        } else {
          values.date = getActiveTabDate()
          values.list_id = dayjs().format('hhmmss')
          saveTaskList(values).then((res) => {
            if (res.code === 200) {
              getPageList()
            }
          })
          console.log('Success:', values)
        }
      })
      .catch((err) => {
        console.log('Failed:', err)
      })

    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleChange = (value: string) => {}
  interface DataType {
    list_id: string
    taskType: string
    projectName: string
    issue: string
    target: string
    workContent: string
    date: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'ISSUE 号',
      dataIndex: 'issue',
      key: 'issue',
      render: (_, record) => {
        return (
          <a
            href={`http://121.40.219.101:8010/upapp.net/${record.projectName}/issues/${record.issue}`}
            target="_blank"
          >
            {record.issue}
          </a>
        )
      },
    },
    {
      title: '支持对象',
      key: 'target',
      dataIndex: 'target',
    },
    {
      title: '工作内容',
      key: 'workContent',
      dataIndex: 'workContent',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              edit(record)
            }}
          >
            编辑
          </Button>

          {dayjs(dayjs(record.date).format('YYYY-MM-DD')).isSame(
            dayjs(dayjs().format('YYYY-MM-DD')),
            'day'
          ) ? null : (
            <Button
              type="primary"
              onClick={() => {
                copy(record)
              }}
            >
              复制
            </Button>
          )}

          <Button
            danger
            type="primary"
            onClick={() => {
              del(record)
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <div>
      <div className="tab_container">
        <div className="tab_bar">
          <div className="bg_list">
            {dateList.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: item.isActive
                      ? item.subColor
                      : 'transparent',
                    transition: `transform ${item.transitionTime}s linear`,
                  }}
                  className={[
                    'bg_item',
                    item.isActive ? 'active' : null,
                    index === currentTabIndex ? 'cover' : null,
                  ].join(' ')}
                ></div>
              )
            })}
          </div>
          <div className="content_list">
            {dateList.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{ color: item.activeColor }}
                  className={[
                    'content_item',
                    index === currentTabIndex ? 'active' : null,
                  ].join(' ')}
                  onClick={() => tabClickMethod(item, index)}
                >
                  <span>{item.text}</span>
                  {index === currentTabIndex && (
                    <div
                      className="inner_tab"
                      style={{
                        backgroundColor:
                          index === currentTabIndex
                            ? item.activeColor
                            : 'transparent',
                      }}
                    >
                      {currentDate === item.date && (
                        <span className="today_icon">今</span>
                      )}

                      <span>{item.text}</span>
                      <span className="date_box">
                        {item.date ? item.date.slice(-5) : ''}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div
          className="tab_controller d_f j_c a_c"
          style={{ fontSize: '18px' }}
        >
          <Tooltip title="上一周" placement="top">
            <LeftOutlined
              onClick={() => {
                goWeekMethod(-1)
              }}
              className="tab_btn mr_s without-outline"
            />
          </Tooltip>
          <Tooltip title="下一周" placement="top">
            <RightOutlined
              onClick={() => {
                goWeekMethod(1)
              }}
              className="tab_btn without-outline"
            />
          </Tooltip>
        </div>
      </div>
      <div style={{ float: 'right', margin: '10px 10px 10px 0' }}>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              add()
            }}
          >
            新增
          </Button>
          <Button
            type="primary"
            onClick={() => {
              exportData()
            }}
          >
            导出周报
          </Button>
        </Space>
      </div>
      <Table
        rowKey={(record) => {
          return record.list_id
        }}
        bordered
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        title="编辑日报"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="600px"
        maskClosable={false}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          initialValues={{ remember: true }}
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
          <Form.Item
            label="工作内容"
            name="workContent"
            rules={[{ required: true, message: '请填写工作内容！' }]}
          >
            <Input.TextArea rows={8} placeholder="请输入工作内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Home
