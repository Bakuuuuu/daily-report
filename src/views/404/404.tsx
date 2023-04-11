import { Col, Row } from 'antd'
import './404Page.css'
import cloud from '@/assets/error_images/cloud.png'
import notfound from '@/assets/error_images/404.png'
function Page() {
  return (
    <div>
      <div className="error-container">
        <div className="error-content">
          <Row gutter={20}>
            <Col lg={12} md={12} sm={24} xl={12} xs={24}>
              <div className="pic-error">
                <img className="pic-error-parent" src={notfound} />
                <img className="pic-error-child left" src={cloud} />
              </div>
            </Col>

            <Col lg={12} md={12} sm={24} xl={12} xs={24}>
              <div className="bullshit">
                <div className="bullshit-oops">抱歉!</div>
                <div className="bullshit-headline">您无法访问当前页面...</div>
                <div className="bullshit-info">
                  请检查您输入的网址是否正确，或点击下面的按钮返回首页。
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
export default Page
