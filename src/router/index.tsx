import React, { lazy, useState, useEffect } from 'react'
import Dashboard from '@/views/Dashboard/Dashboard'
import Login from '@/views/Login'
import Page404 from '@/views/404/404'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DocumentTitle from 'react-document-title'

const Page4 = lazy(() => import('@/views/GatherDaily/Page4'))
const Page3 = lazy(() => import('@/views/ManageDaily/Page3'))
const Page1 = lazy(() => import('@/views/Home/page1'))
const Page2 = lazy(() => import('@/views/WriteDaily/page2'))
const loadingComponent = (component: JSX.Element, title: string) => (
  <DocumentTitle title={title}>
    <React.Suspense fallback={<div>Loading...</div>}>
      {component}
    </React.Suspense>
  </DocumentTitle>
)
const routers = [
  {
    path: '/',
    element: <Navigate to={'/login'} />,
  },
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        path: '/home',
        element: loadingComponent(<Page1 />, 'Home'),
      },
      {
        path: '/writeDaily',
        element: loadingComponent(<Page2 />, '填写日报'),
      },
      {
        path: '/manageDaily',
        element: loadingComponent(<Page3 />, '日报管理'),
      },
      {
        path: '/gatherDaily',
        code: '/gatherDaily',
        element: loadingComponent(<Page4 />, '日报汇总'),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <Navigate to={'/home'} />,
  },
]
export default routers
