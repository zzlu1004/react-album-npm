/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react'
import { Button, Form, Input, message, Carousel, Icon } from 'antd'
import { parseTime } from '../../utils/index'
import { editAlbumById } from '../../api'
import './index.less'

@Form.create()
class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentImgs: []
        }
        this.insert = this.insert.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.handlePrev = this.handlePrev.bind(this)
        this.nameChange = this.nameChange.bind(this)
    }

    // 编辑图片
    imgEdit(e, key) {
        e.preventDefault()
        const { id, name, description } = this.state.currentImgs[key]
        if(typeof(id) !== 'number') {
            return
        }
        if(!name.replace(/\s+/g, '')) {
            message.error('图片名不能为空')
            return
        }
        editAlbumById(id, name, description).then(res => {
            if (res.status) {
                message.success('操作成功')
                this.props.changeImgInfo(this.state.currentImgs[key])
            }
        })

    }

    // 下一页
    handleNext() {
        this.refs.imgs.next()
    }

    // 上一页
    handlePrev() {
        this.refs.imgs.prev()
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentImgs: props.currentImgs
        })
    }

    // 修改图片名称
    nameChange(e, key) {
        e.persist()
        const currentImgs = this.state.currentImgs
        currentImgs[key].name = e.target.value
        this.setState({
            currentImgs: currentImgs
        })
    }

    // 修改图片备注
    ChangeDesc(e, key) {
        e.persist()
        const currentImgs = this.state.currentImgs
        currentImgs[key].description = e.target.value
        this.setState({
            currentImgs: currentImgs
        })
    }

    // 关闭弹框，并插入数据
    insert() {
        this.props.closeAlbum(this.props.currentImgs)
    }

    render() {
        // const { getFieldDecorator } = this.props.form
        // 选中的图片列表
        const { currentImgs } = this.state
        // 是否为公共图库中的图片
        const { fromPublic } = this.props
        
        const carouselItem = currentImgs.length > 1 && currentImgs.map((val, key) => {
            return (
                <div key={key}>
                    <div className='detail-img-wrapper'>
                        <img className='detail-img' src={val.save_domain + '/' + val.image_path} alt='' />
                    </div>
                    <Form className='detail-form' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} onSubmit={e => this.imgEdit(e, key)}>
                        <Form.Item label='图片名' className='img-name'>
                            {/* {getFieldDecorator(`name${key}`, {
                                initialValue: val.name,
                                rules: [{ required: true, message: '图片名不能为空' }]
                            })(<Input disabled={fromPublic} />)} */}
                            <Input disabled={fromPublic} defaultValue={val.name} onChange={e => this.nameChange(e, key)} />
                        </Form.Item>
                        <Form.Item label='图片大小'>{(val.size / 1024).toFixed(2)}KB</Form.Item>
                        <Form.Item label='上传时间'>{parseTime(val.created_at)}</Form.Item>
                        <Form.Item label='最后修改时间'>{parseTime(val.updated_at)}</Form.Item>
                        <Form.Item label='备注'>
                            {/* {getFieldDecorator(`description${key}`, {
                                initialValue: val.description
                            })(<Input disabled={fromPublic} />)} */}
                            <Input disabled={fromPublic} defaultValue={val.description} onChange={e => this.ChangeDesc(e, key)} />
                        </Form.Item>
                        {
                            !fromPublic && (
                                <Form.Item className='form-submit' wrapperCol={{ span: 14, offset: 10 }}>
                                    <Button htmlType='submit'>提交</Button>
                                </Form.Item>
                            )
                        }
                    </Form>
                </div>
            )
        })

        return (
            <div className='detail'>
                {currentImgs.length > 1 && (
                    <div className='icon-wrapper'>
                        <Icon className='icon-prev' type='left' onClick={this.handlePrev} />
                        <Icon className='icon-next' type='right' onClick={this.handleNext} />
                    </div>
                )}
                 
                <div className='content-detail scroll'>
                    {currentImgs.length <= 0 ? (
                        <div className='no-data'>没有选中</div>
                    ) : (
                        currentImgs.length == 1 ? (
                            <div>
                                <div className='detail-img-wrapper'>
                                    <img className='detail-img' src={currentImgs[0].save_domain + '/' + currentImgs[0].image_path} alt='' />
                                </div>
                                <Form className='detail-form' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} onSubmit={e => this.imgEdit(e, 0)}>
                                    <Form.Item label='图片名' className='img-name'>
                                        <Input disabled={fromPublic} defaultValue={currentImgs[0].name} onChange={e => this.nameChange(e, 0)} />
                                    </Form.Item>
                                    <Form.Item label='图片大小'>{(currentImgs[0].size / 1024).toFixed(2)}KB</Form.Item>
                                    <Form.Item label='上传时间'>{parseTime(currentImgs[0].created_at)}</Form.Item>
                                    <Form.Item label='最后修改时间'>{parseTime(currentImgs[0].updated_at)}</Form.Item>
                                    <Form.Item label='备注'>
                                        <Input disabled={fromPublic} defaultValue={currentImgs[0].description} onChange={e => this.ChangeDesc(e, 0)} />
                                    </Form.Item>
                                    {
                                        !fromPublic && (
                                            <Form.Item className='form-submit' wrapperCol={{ span: 14, offset: 10 }}>
                                                <Button htmlType='submit'>提交</Button>
                                            </Form.Item>
                                        )
                                    }
                                </Form>
                            </div>
                        ) : (
                            <Carousel className='carousel' ref='imgs' dots={false}>
                                {carouselItem}
                            </Carousel>
                        )
                    )}
                </div>
                <div className='operation flex-h flex-vc flex-hc'>
                    <Button type='primary' onClick={this.insert}>插入</Button>
                </div>
            </div>
        )
    }
}

export default Detail