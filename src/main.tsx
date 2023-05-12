import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.css'
import '@/assets/styles/global.scss'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import 'moment/dist/locale/zh-cn'
import locale from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </Provider>
)
