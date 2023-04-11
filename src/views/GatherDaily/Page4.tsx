import { Radio, Space, DatePicker, Table, Button, message, Select } from 'antd'
import type {
  RadioChangeEvent,
  DatePickerProps,
  TimeRangePickerProps,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ExportJsonExcel from 'js-export-excel'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import './Page4.css'
import moment from 'moment'
import {
  getTaskListByDate,
  getUserList,
  getTaskListById,
  getWeekData,
} from '@/request/api'

function About() {
  const [value, setValue] = useState(1)
  const [value2, setValue2] = useState('')
  const [data, setData] = useState<DataType[]>([])
  const [date, setDate] = useState<Array<string>>([''])
  const [userList, setUserList] = useState<UserList[]>([])
  const [type, setType] = useState<PickerType>('date')
  const [key, setKey] = useState('')
  const dateFormat = 'YYYY-MM-DD'
  const { Option } = Select
  const { RangePicker } = DatePicker
  const options = [
    {
      label: '本周',
      value: `${dayjs().day(1).format('YYYY-MM-DD')},${dayjs()
        .day(5)
        .format('YYYY-MM-DD')}`,
    },
    {
      label: '上周',
      value: `${dayjs()
        .subtract(1, 'week')
        .day(1)
        .format('YYYY-MM-DD')},${dayjs()
        .subtract(1, 'week')
        .day(5)
        .format('YYYY-MM-DD')}`,
    },
    {
      label: '本月',
      value: `${dayjs().startOf('month').format('YYYY-MM-DD')},${dayjs()
        .endOf('month')
        .format('YYYY-MM-DD')}`,
    },
    {
      label: '上月',
      value: `${dayjs()
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD')},${dayjs()
        .subtract(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD')}`,
    },
  ]
  useEffect(() => {
    setDate([moment().format(dateFormat)])
    getTaskListById({ date: [moment().format(dateFormat)], id: value }).then(
      (res) => {
        setData(res.data)
      }
    )
    getUserList().then((res) => {
      setUserList(res.data)
    })
  }, [])
  const radioChange = (e: RadioChangeEvent) => {
    getTaskListById({
      date: date,
      id: e.target.value,
    }).then((res) => {
      setData(res.data)
    })
    setValue(e.target.value)
  }
  const dateRadioChange = (e: RadioChangeEvent) => {
    setValue2(e.target.value)
    setKey(String(new Date()))
    setDate(e.target.value.split(','))
    getTaskListById({
      date: e.target.value.split(','),
      id: value,
    }).then((res) => {
      setData(res.data)
    })
  }
  const dateChange = (date: any, dateString: string) => {
    // getTaskListById({
    //   date: [dateString],
    //   id: value,
    // }).then((res) => {
    //   setData(res.data)
    // })
    setValue2('')
    setDate([dateString])
  }
  const rangeChange = (date: any, dateString: Array<string>) => {
    setValue2('')
    getTaskListById({
      date: dateString,
      id: value,
    }).then((res) => {
      setData(res.data)
      setDate(dateString)
    })
  }
  const selectChange = (value: PickerType) => {
    setType(value)
    setData([])
  }
  const search = () => {
    getTaskListById({
      date: date,
      id: value,
    }).then((res) => {
      setData(res.data)
    })
  }
  const exportData = () => {
    const weekDateList: string[] = []
    const firstDateInWeek = dayjs().day(1).format('YYYY-MM-DD')
    weekDateList.push(firstDateInWeek)
    for (let i = 1; i <= 6; i++) {
      const weekDate = dayjs(firstDateInWeek)
        .add(i, 'days')
        .format('YYYY-MM-DD')
      weekDateList.push(weekDate)
    }
    getTaskListByDate({
      date: date,
    }).then((res) => {
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
              date: moment(item.date).format('YYYY-MM-DD'),
              nickname: item.nickname,
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
            columnWidths: [8, 8, 8, 8, 8, 8, 8],
            sheetFilter: [
              'date',
              'nickname',
              'taskType',
              'projectName',
              'issue',
              'target',
              'workContent',
            ],
            sheetHeader: [
              '日期',
              '开发人员',
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
    })
  }
  interface DataType {
    list_id: string
    taskType: string
    projectName: string
    issue: string
    target: string
    workContent: string
  }
  interface UserList {
    id: number
    nickname: string
  }
  type ExportType = {
    date: string
    nickname: string
    taskType: string
    projectName: string
    issue: string
    target: string
    workContent: string
  }
  type PickerType = 'time' | 'date'
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
  ]
  return (
    <div className="totalReport" style={{ height: '100%', padding: '10px' }}>
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
        <div
          className="left_container"
          style={{ width: '20%', paddingRight: '10px' }}
        >
          <div
            style={{
              // textAlign: 'center',
              fontSize: '16px',
              height: '50px',
              lineHeight: '50px',
              marginBottom: '10px',
              borderBottom: '1px solid #ccc',
            }}
          >
            人员列表
          </div>
          <Radio.Group onChange={radioChange} value={value}>
            <Space direction="vertical">
              {userList.map((i) => {
                return (
                  <Radio.Button key={i.id} value={i.id}>
                    {i.nickname}
                  </Radio.Button>
                )
              })}
            </Space>
          </Radio.Group>
        </div>
        <div
          className="right_container"
          style={{
            maxHeight: '660px',
            flex: 1,
            borderLeft: '2px dashed #dcdfe6',
            paddingLeft: '10px',
            paddingRight: '10px',
            overflowY: 'scroll',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              height: '50px',
              lineHeight: '50px',
              marginBottom: '10px',
              borderBottom: '1px solid #ccc',
            }}
          >
            <div>
              日报日期：
              <Select
                value={type}
                onChange={(value) => {
                  selectChange(value)
                }}
                style={{ marginRight: '10px' }}
              >
                <Option value="date">日期</Option>
                <Option value="range">范围</Option>
              </Select>
              {type === 'date' ? (
                <DatePicker
                  key={key}
                  // defaultValue={moment(moment().format(dateFormat), dateFormat)}
                  format={dateFormat}
                  onChange={dateChange}
                />
              ) : (
                <RangePicker key={key} onChange={rangeChange} />
              )}
              <Radio.Group
                options={options}
                onChange={dateRadioChange}
                value={value2}
                optionType="button"
                buttonStyle="solid"
                style={{ marginLeft: '10px' }}
              />
              <div style={{ float: 'right' }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      search()
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      exportData()
                    }}
                  >
                    导出数据
                  </Button>
                </Space>
              </div>
            </div>
          </div>
          <div>
            <Table
              rowKey={(record) => {
                return record.list_id
              }}
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
