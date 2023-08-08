import React, { Component } from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
// import { Drawer, Button } from 'antd'

import './header.scss'
// import { RightOutlined } from '@ant-design/icons'

class Header extends Component {
  state = {
    visible: false
  }

  showDrawer = () => {
    this.setState({
      visible: true
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <nav className='menu'>
        <div className='menu__logo'>
          <a href=''>Logo</a>
        </div>
        <div className='menu__container'>
          <div className='menu_left'>
            <LeftMenu />
          </div>
          <div className='menu_rigth'>
            <RightMenu />
          </div>
          {/* <Button className='menu__mobile-button' type='primary' onClick={this.showDrawer}>
            <RightOutlined />
          </Button>
          <Drawer
            title='Basic Drawer'
            placement='right'
            className='menu_drawer'
            closable={false}
            onClose={this.onClose}
            open={this.state.visible}
          >
            <LeftMenu />
            <RightMenu />
          </Drawer> */}
        </div>
      </nav>
    )
  }
}

export default Header
