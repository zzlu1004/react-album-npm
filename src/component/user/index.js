/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react'
import { Icon, Button, Checkbox, Pagination, Modal, message, Popover, Input, Upload } from 'antd'
import './index.less'
import Tree from '../tree'
import Detail from '../detail'
import { getAlbumCategory, getPictureDirListData, delPictureByIds, addAlbumCategory, editAlbumCategoryById, delAlbumCategoryById } from '../../api'
import { getAppConfig } from '../../utils/config'
const { Search } = Input
const { confirm } = Modal

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            upLoading: false, // 上传图片loading
            page_size: 30, // 每页多少条
            page: 1, // 页码
            total: 0, // 记录总数
            currentTreeId: 0, // 选中的节点id
            currentImgs: [], // 选中的图片
            choosedNumForDel: 0, // 已选中的数量
            pictureDirList: [], // 节点目录
            imgList: [], // 图片列表
            addGroupisShow: true, // 新增分组是否显示
            editGroupisShow: false, // 修改分组是否显示
            editGroupName: '', // 修改分组时，分组名称
            uploadImgUrl: getAppConfig().baseUrl + '/coroutine/picture/file/upload'
        } 

        this.pageChange = this.pageChange.bind(this)
        this.delImgs = this.delImgs.bind(this)
        this.chooseNode = this.chooseNode.bind(this)
        this.chooseAll = this.chooseAll.bind(this)
        this.delGroup = this.delGroup.bind(this)
        this.changeImgInfo = this.changeImgInfo.bind(this)
    }

    componentDidMount() {
        // 获取目录节点
        this.getTrees()
        // 获取根目录下图片
        this.getImgs()
    }

    // 获取目录节点
    getTrees() {
        getAlbumCategory().then(res => {
            if (res.status) {
                this.setState({
                    pictureDirList: res.data
                })
            }
        })
    }

    // 加载目录对应的图片
    getImgs() {
        const param = {
            page: this.state.page, // 当前页码
            category_id: this.state.currentTreeId || '', // 当前查看的分类ID
            page_size: this.state.page_size // 每页展示的数量
        }
        getPictureDirListData(param).then(res => {
            if (res.status) {
                const imgList = res.data.items.map(val => {
                    val.forDel = false // 是否选中，做删除用
                    val.forInsert = false // 是否选中，做抛出数据用
                    return val
                })
                this.setState({
                    imgList: imgList,
                    total: res.data.total_count
                })
            }
        })
    }

    // 点击左侧导航
    chooseNode(val) {
        if (!val) {
            return
        }
        this.setState({
            currentTreeId: val.id,
            page: 1,
            choosedNumForDel: 0,
            addGroupisShow: val.pid === 0 || val.pid === undefined,
            editGroupisShow: val.pid >= 0,
            editGroupName: val.name
        }, () => {
            // console.log(val)
            this.getImgs()
        })
    }

    // 分页
    pageChange(index) {
        this.setState({
            page: index,
            choosedNumForDel: 0,
            currentImgs: []

        }, () => {
            this.getImgs()
        })
       
    }
    
    // 删除图片
    delImgs() {
        const that = this
        confirm({
            title: '是否确认此操作?',
            onOk() {
                const checkedArr = that.state.imgList.filter(val => {
                    if (val.forDel) {
                        return val.id
                    }
                })
                const ids = checkedArr.map(val => {
                    return val.id
                })
                delPictureByIds(ids).then(res => {
                    if (res.status) {
                        message.success('删除成功')
                        that.setState({
                            page: 1
                        }, () => {
                            // 重新获取图片列表
                            that.getImgs()
                        })
                        
                    }
                })
            },
            onCancel() {
                console.log('Cancel')
            }
        })
    }

    // 点击图片
    chooseImg(val, i) {
        const imgList = this.state.imgList
        // 当前选中状态
        const forInsertCurrent = val.forInsert
        // 设置是否为删除选择，取反结果
        val.forDel = !Boolean(val.forDel)

        // 设置是否为抛出数据选择
        // 是否多选
        if (this.props.multiple) { // 多选
            val.forInsert = !Boolean(val.forInsert)
        } else { // 单选
            imgList.forEach(item => {
                item.forInsert = false
            })
            val.forInsert = !Boolean(forInsertCurrent)
        }
        
        // 给新的val重新赋值
        imgList[i] = val
        // 获取删除已选中的数量
        const choosedNumForDel = imgList.filter(val => {
            return val.forDel
        })
        // 获取抛出数据的列表
        const currentImgs = imgList.filter(val => {
            return val.forInsert
        })

        this.setState({
            currentImgs: currentImgs,
            imgList: imgList,
            choosedNumForDel: choosedNumForDel.length
        })
       
    }

    // 接收图片编辑后的数据，替换列表中的数据
    changeImgInfo(info) {
        const imgList = this.state.imgList
        imgList.forEach(val => {
            if (val.id == info.id) {
                val.name = info.name
                val.description = info.description
            }
        })
        this.setState({
            imgList: imgList
        })
    }

    // 全选或取消全选
    chooseAll(e) {
        const status = e.target.checked
        const imgList = this.state.imgList
        imgList.forEach(val => {
            val.forDel = status
        })
        this.setState({
            imgList: imgList,
            choosedNumForDel: status ? imgList.length : 0
        })
    }

    // 添加分组
    addGroup(val) {
        val = val.replace(/\s+/g, '')
        if (!val) {
            message.error('组名不能为空')
            return
        }
        addAlbumCategory(this.state.currentTreeId, val).then(res => {
            if (res.status) {
                message.success('添加成功')
                // 重新获取目录节点
                this.getTrees()

            }
        })
    }

    // 修改分组
    editGroup(val) {
        val = val.replace(/\s+/g, '')
        if (!val) {
            message.error('组名不能为空')
            return
        }

        editAlbumCategoryById(this.state.currentTreeId, val).then(res => {
            if (res.status) {
                message.success('修改成功')
                // 重新获取目录节点
                this.getTrees()

            }
        })
    }

    // 删除分组
    delGroup() {
        const that = this
        if (that.state.currentTreeId <= 0) {
            return
        }
        confirm({
            title: '是否确认此操作?',
            onOk() {
                delAlbumCategoryById(that.state.currentTreeId).then(res => {
                    if (res.status) {
                        message.success('删除成功')
                        // 重新获取目录节点
                        that.getTrees()
                    }
                })
            },
            onCancel() {
                console.log('Cancel')
            }
        })
    }

    render() {
        // 图片列表
        const imgList = this.state.imgList.map((val, i) => {
            return (
                <div className='img-item-wrapper' key={i} onClick={() => this.chooseImg(val, i)}>
                    <div className={val.forInsert ? 'img-item flex-h flex-vc flex-hc active' : 'img-item flex-h flex-vc flex-hc'}>
                        <img className='img' src={val.save_domain + '/' + val.image_path} alt='' />
                        <div className='img-title'>{val.name}</div>
                        {val.forDel &&
                            // 选中做删除用
                            <div className='del-wrapper flex-h flex-vc flex-hc'>
                                <Icon type='check' />
                            </div>}
                        {val.forInsert &&
                            // 选中做抛出数据用
                            <div className='choose-wrapper flex-h flex-vc flex-hc'>
                                <Icon type='check' />
                            </div>}
                    </div>
                </div>
            )
        })

        // 添加分组气泡框
        const addGroupContent = (
            <Search
                placeholder='请输入分组名称'
                enterButton='添加'
                size='default'
                onSearch={value => this.addGroup(value)}
            />
        )

        // 修改分组气泡框
        const editGroupContent = (
            <Search
                placeholder='请输入分组名称'
                enterButton='修改'
                size='default'
                value={this.state.editGroupName}
                onSearch={value => this.editGroup(value)}
            />
        )

        // 图片上传
        const uploadProps = {
            name: 'upfile',
            action: this.state.uploadImgUrl,
            withCredentials: true,
            showUploadList: false,
            data: {
                category_id: this.state.currentTreeId // 当前相册所在的分类ID
            },
            headers: {
            //   authorization: 'authorization-text'
            },
            beforeUpload: (file, fileList) => {
                const type = file.name.slice(file.name.lastIndexOf('.') + 1, )
                const typeSupport = ['jpeg','jpg','png','gif']
                const isHas = typeSupport.indexOf(type)
                const size = file.size / 1024 / 1024

                if(isHas < 0) {
                    message.error('请选择正确的图片类型')
                    return false
                }
                if(size > 2) {
                    message.error('图片大小不能超过2MB')
                    return false
                }
                this.setState({
                    upLoading: true
                })
            },
            onChange: info => {
                // if (info.file.status !== 'uploading') {
                //     console.log(info.file, info.fileList)
                // }
                if (info.file.status === 'done') {
                    if (info.file.response.status) {
                        this.setState({
                            upLoading: false
                        })
                        message.success('上传成功')
                        this.getImgs()
                    } else {
                        message.error(info.file.response.message)
                    }
                } else if (info.file.status === 'error') {
                    message.error('上传失败')
                }
            }
        }

        return (
            <div className='user flex-h'>
                <div className='left'>
                    <Upload className='upload-wrapper' {...uploadProps}>
                        <div className='add-wrapper flex-h flex-vc flex-hc'>
                            {
                                !this.state.upLoading ? (
                                    <Icon className='icon' type='cloud-upload' />
                                ) : (
                                    <Icon className='icon' type='loading' />
                                )
                            }
                            <div >上传图片</div>
                        </div>
                    </Upload>
                    <div className='tree scroll'>
                        <Tree pictureDirList={this.state.pictureDirList} chooseNode={this.chooseNode} />
                    </div>
                </div>
                <div className='right flex-v'>
                    <div className='group-wrapper flex-h flex-vc'>
                        {
                            this.state.addGroupisShow && (
                                <Popover className='add-group' placement='bottom' content={addGroupContent} trigger='click'>
                                    <Button>新增分组</Button>
                                </Popover>
                            )
                        }
                        {
                            this.state.editGroupisShow && (
                                <div>
                                    <Popover className='edit-group' placement='bottom' content={editGroupContent} trigger='click'>
                                        <Button>修改分组名称</Button>
                                    </Popover>
                                    <Button onClick={this.delGroup}><Icon type='delete' /></Button>
                                </div>
                            )
                        }
                    </div>
                    <div className='right-content flex-h'>
                        <div className='list-wrapper'>
                            <div className='content-list scroll  flex-h flex-wrap'>
                                {imgList.length ? imgList : (
                                    <div className='no-img'>暂无图片</div>
                                )}
                            </div>
                            <div className='pagination  flex-h flex-hb'>
                                <div className='pagination-left flex-h flex-vc'>
                                    <Checkbox checked={this.state.choosedNumForDel > 0} onChange={this.chooseAll}>
                                        全选
                                        {this.state.choosedNumForDel > 0 &&
                                            (<span className='choose-num'>已选中{this.state.choosedNumForDel}条</span>
                                        )}
                                    </Checkbox>
                                    {this.state.choosedNumForDel > 0 ? (
                                        <span className='del-active' onClick={this.delImgs}>删除</span>
                                        ) : (
                                            <span className='del-not'>删除</span>
                                    )}
                                </div>
                                <div className='pagination-right flex-h flex-vc'>
                                    <Pagination size='small' total={this.state.total} pageSize={this.state.page_size} current={this.state.page} onChange={this.pageChange} />
                                </div>
                            </div>
                        </div>
                        <div className='detail-wrapper'>
                            <Detail currentImgs={this.state.currentImgs} changeImgInfo={this.changeImgInfo} closeAlbum={this.props.closeAlbum} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default User