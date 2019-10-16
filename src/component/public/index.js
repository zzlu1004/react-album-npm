/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react'
import { Icon, Pagination } from 'antd'
import './index.less'
import Tree from '../tree'
import Detail from '../detail'
import { publicPictureCategory, publicPictureList } from '../../api'

class Public extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_size: 30, // 每页多少条
            page: 1, // 页码
            total: 0, // 记录总数
            currentTreeId: 0, // 选中的节点id
            currentImgs: [], // 选中的图片
            pictureDirList: [], // 节点目录
            imgList: [] // 图片列表
        }
    }

    componentDidMount() {
        // 获取目录节点
        this.getTrees()
        // 获取根目录下图片
        this.getImgs()
    }

    // 获取目录节点
    getTrees() {
        publicPictureCategory().then(res => {
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
        publicPictureList(param).then(res => {
            if (res.status) {
                const imgList = res.data.items.map(val => {
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
        this.setState({
            currentTreeId: val.id,
            page: 1,
            addGroupisShow: val.pid === 0 || val.pid === undefined,
            editGroupisShow: val.pid >= 0
        }, () => {
            this.getImgs()
        })
    }

    // 分页
    pageChange(index) {
        this.setState({
            page: index,
            currentImgs: []

        }, () => {
            this.getImgs()
        })
       
    }

    // 点击图片
    chooseImg(val, i) {
        const imgList = this.state.imgList
        // 当前选中状态
        const forInsertCurrent = val.forInsert

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
  
        // 获取抛出数据的列表
        const currentImgs = imgList.filter(val => {
            return val.forInsert
        })

        this.setState({
            currentImgs: currentImgs,
            imgList: imgList
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

    render() {
        
        // 图片列表
        const imgList = this.state.imgList.map((val, i) => {
            return (
                <div className='img-item-wrapper' key={i} onClick={() => this.chooseImg(val, i)}>
                    <div className={val.forInsert ? 'img-item flex-h flex-vc flex-hc active' : 'img-item flex-h flex-vc flex-hc'}>
                        <img className='img' src={val.save_domain + '/' + val.image_path} alt='' />
                        <div className='img-title'>{val.save_name}</div>
                        {val.forInsert &&
                            // 选中做抛出数据用
                            <div className='choose-wrapper flex-h flex-vc flex-hc'>
                                <Icon type='check' />
                            </div>}
                    </div>
                </div>
            )
        })

        return (
            <div className='public flex-h'>
                <div className='left'>
                    <div className='tree scroll'>
                        <Tree pictureDirList={this.state.pictureDirList} chooseNode={this.chooseNode} />
                    </div>
                </div>
                <div className='right flex-v'>
                    <div className='right-content flex-h'>
                        <div className='list-wrapper'>
                            <div className='content-list scroll  flex-h flex-wrap'>
                                {imgList.length ? imgList : (
                                    <div className='no-img'>暂无图片</div>
                                )}
                            </div>
                            <div className='pagination  flex-h flex-he'>
                                <div className='pagination-right flex-h flex-vc'>
                                    <Pagination size='small' total={this.state.total} pageSize={this.state.page_size} current={this.state.page} onChange={this.pageChange} />
                                </div>
                            </div>
                        </div>
                        <div className='detail-wrapper'>
                            <Detail currentImgs={this.state.currentImgs} changeImgInfo={this.changeImgInfo} closeAlbum={this.props.closeAlbum} fromPublic={true} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Public