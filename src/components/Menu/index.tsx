import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
type MenuItem = {
  label: string
  key: string
  icon?: React.ReactNode
  children?: MenuItem[]
}

const items: MenuItem[] = [
  {
    label: '首页',
    key: '/home',
    icon: <PieChartOutlined />,
  },
  {
    label: '填写日报',
    key: '/writeDaily',
    icon: <DesktopOutlined />,
  },
  {
    label: '日报管理',
    key: '/manageDaily',
    icon: <UserOutlined />,
  },
  {
    label: '日报汇总',
    key: '/gatherDaily',
    icon: <TeamOutlined />,
  },
]
const SliderMenu: React.FC = () => {
  let openKey: string = ''
  const navigateTo = useNavigate()
  const currentRoute = useLocation()
  const [openKeys, setOpenKeys] = useState([openKey])
  const [menuItem, setMenuItem] = useState(items)
  const permission = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string).permission
    : ''
  useEffect(() => {
    const index = menuItem.findIndex((i) => i.label === '日报汇总')
    if (permission !== 'admin') {
      console.log(permission)

      menuItem.splice(index, 1)
      const arr = menuItem.concat([])
      setMenuItem(arr)
    }
  }, [])
  function findKey(obj: { key: string }) {
    return obj.key === currentRoute.pathname
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]['children'] as MenuItem[]
    if (items[i]['children'] && item.length > 0 && item.find(findKey)) {
      openKey = items[i].key
      break
    }
  }

  const menuClick = (e: { key: string }) => {
    navigateTo(e.key)
  }
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys([keys[keys.length - 1]])
  }
  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={[currentRoute.pathname]}
      mode="inline"
      items={menuItem}
      onClick={menuClick}
      onOpenChange={handleOpenChange}
      openKeys={openKeys}
    />
  )
}
export default SliderMenu
