/**
 * Created by out_xu on 17/3/19.
 */
import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import Footer from '../plugins/footer';
import Navigation from '../../components/plugins/navigation/adminnav';
import AdminSider from '../../components/plugins/sider/adminsider';
import './index.less';
import { } from 'antd';

class AdminComponent extends Component {

  render() {
    return (
      <QueueAnim id="admin" type={['left', 'right']} delay={100}>
        <Navigation />
        <div className="admin-wrap" key="admin-wrap">
          <AdminSider />
          {this.props.children}
        </div>
        <Footer />
      </QueueAnim>
    );
  }
}

AdminComponent.propTypes = {};
AdminComponent.defaultProps = {};

export default AdminComponent;