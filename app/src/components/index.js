/**
 * Created by out_xu on 16/12/21.
 */
import React from 'react'
import { Icon } from 'antd'
import Navigation from 'containers/Navigation'
import Sider from 'components/plugins/Sider'
import Footer from 'components/plugins/Footer'
import './index.less'
import { pureRender } from 'utils'
// 配置整体组件
@pureRender
class AppComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapse: true
    }
    this.onCollapseChange = this.onCollapseChange.bind(this)
  }

  onCollapseChange () {
    this.setState({
      collapse: !this.state.collapse
    })
  }

  render () {
    const collapse = this.state.collapse
    const {path = 'homepage'} = this.props.routes[1]
    const years = (new Date()).getFullYear()
    return (
      <div className={collapse ? 'ant-layout-aside ant-layout-aside-collapse' : 'ant-layout-aside'}>
        <aside className='ant-layout-sider'>
          <Sider
            collapse={collapse}
            navselect={path}
          />
          <div className='ant-aside-action' onClick={this.onCollapseChange}>
            <Icon type={collapse ? 'right' : 'left'} />
          </div>
        </aside>
        <div className='ant-layout-main'>
          <Navigation />
          <div className='main-content'>
            {this.props.children}
          </div>
          <Footer year={years} />
        </div>
      </div>
    )
  }
}

export default AppComponent
