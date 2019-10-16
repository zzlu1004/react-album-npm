/* eslint-disable react/jsx-handler-names */
import React, { PureComponent } from 'react'
import { Modal, Tabs } from 'antd'
import PropTypes from 'prop-types'
import User from './user/index.js'
import Public from './public/index.js'
import { ConfigProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN'
import '../assets/css/common.css'
// antd样式
import 'antd/dist/antd.css'

const { TabPane } = Tabs

class Album extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            albenVisible: false, // 弹框是否显示
            // multiple: true // 是否开启多选
        }
        this.openAlbum = this.openAlbum.bind(this)
        this.closeAlbum = this.closeAlbum.bind(this)
    }

    componentDidMount() {
        // 通过pros接收父组件传来的方法
        // this.props.onRef(this)
    }

    // 打开图片库组件
    openAlbum() {
        this.setState({
            albenVisible: true
        })
    }

    // 关闭图片库组件
    closeAlbum(val) {
        this.setState({
            albenVisible: false
        })
        val.length && this.props.getImgs(val)
    }

    render() {
        const { multiple } = this.props
        return (
            <ConfigProvider locale={zhCN}>
                <Modal
                    visible={this.state.albenVisible}
                    footer={null}
                    width={1000}
                    bodyStyle={{ padding: 0 }}
                    onCancel={this.closeAlbum}
                >
                    <Tabs type='card' tabBarStyle={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }} tabBarGutter={2}>
                        <TabPane tab='我的图库' key='1'>
                            <User  closeAlbum={this.closeAlbum} multiple={multiple} />
                        </TabPane>
                        <TabPane tab='公共图库' key='2'>
                            <Public closeAlbum={this.closeAlbum} multiple={multiple} />
                        </TabPane>
                    </Tabs>
                </Modal>
            </ConfigProvider>
        )
    }
}

// 校验传值类型
Album.propTypes = {
    multiple: PropTypes.bool,
}

export default Album