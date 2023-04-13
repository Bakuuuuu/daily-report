import { Card } from 'antd'
import { DeleteOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons'
import { Fragment } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface DragItem {
  type: string
  id: number
  index: number
}

interface DragableItemProps {
  id: number
  index: number
  text: FormList
  moveItem: (dragIndex: number, hoverIndex: number) => void
  del: (value: FormList) => void
  edit: (value: FormList) => void
  copy: (value: FormList) => void
}
type FormList = {
  list_id: string
  date: string
  taskType: string
  projectName: string
  issue: string
  target: string
  workContent: string
}
function DragableItem({
  id,
  index,
  text,
  moveItem,
  del,
  edit,
  copy,
}: DragableItemProps) {
  const [{ isDragging }, drag] = useDrag({
    item: { id, index },
    type: 'ITEM',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    hover(item: DragItem) {
      if (item.index !== index) {
        moveItem(item.index, index)
        item.index = index
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div ref={drop}>
        <Fragment key={text.list_id}>
          <Card
            key={text.list_id}
            title={'任务列表'}
            hoverable={true}
            type={'inner'}
            extra={[
              <span
                className="card_icon"
                key={text.list_id + 'a'}
                style={{ fontSize: '18px', marginRight: '10px' }}
                onClick={() => {
                  edit(text)
                }}
              >
                <EditOutlined />
              </span>,
              <span
                className="card_icon"
                key={text.list_id + 'b'}
                style={{ fontSize: '18px', marginRight: '10px' }}
                onClick={() => {
                  copy(text)
                }}
              >
                <CopyOutlined />
              </span>,
              <span
                className="card_icon"
                key={text.list_id + 'c'}
                style={{ fontSize: '18px' }}
                onClick={() => {
                  del(text)
                }}
              >
                <DeleteOutlined />
              </span>,
            ]}
            style={{
              marginTop: '10px',
              border: isOver ? '1px dashed #1890ff' : '',
            }}
          >
            {text.taskType ? (
              <div>
                <b>任务类型</b> : {text.taskType}
              </div>
            ) : null}
            {text.projectName ? (
              <div>
                <b>项目名称</b> : {text.projectName}
              </div>
            ) : null}
            {text.issue ? (
              <div>
                <b>ISSUE 号</b> : {text.issue}
              </div>
            ) : null}
            {text.target ? (
              <div>
                <b>支持对象</b> : {text.target}
              </div>
            ) : null}
            {text.workContent ? (
              <div>
                <b>工作内容</b> : {text.workContent}
              </div>
            ) : null}
          </Card>
        </Fragment>
      </div>
    </div>
  )
}
export default DragableItem
