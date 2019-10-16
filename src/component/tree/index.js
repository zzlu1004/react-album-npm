/* eslint-disable react/jsx-handler-names */
import React, { PureComponent } from 'react'
import { Icon, Tree } from 'antd'
const { TreeNode } = Tree
class TreeDom extends PureComponent {
    constructor(props) {
        super(props)
        this.chooseNode = this.chooseNode.bind(this)
    }

    // 获取当前选中的节点信息
    chooseNode(keys) {
        if (!keys.length) {
            this.props.chooseNode(null)
            return
        }
        const [key1, key2, key3, key4] = keys[0].split('-')
        
        if (key3 === undefined) {
            this.props.chooseNode({
                id: 0
            })
            return
        }
        if (key4 === undefined) {
            this.props.chooseNode(this.props.pictureDirList[key3])
            return
        }
        if (key1 !== undefined && key2 !== undefined && key3 !== undefined && key4 !== undefined) {
            this.props.chooseNode(this.props.pictureDirList[key3]._child[key4])
        }
    }

    render() {
        // 左侧加导航节点
        const treeNode = this.props.pictureDirList.map((val, i) => {
            if (val._child) {
                const treeNodeInside = val._child.map((valChild, iChild) => {
                    return (
                        <TreeNode icon={<Icon type='folder-open' />} title={valChild.name} key={'0-0-' + i + '-' + iChild} />
                    )
                })
                return (
                    <TreeNode icon={<Icon type='folder-open' />} title={val.name} key={'0-0-' + i}>
                        {treeNodeInside}
                    </TreeNode>
                )
            } else {
                return <TreeNode icon={<Icon type='folder-open' />} title={val.name} key={'0-0-' + i} />
            }
        })

        return (
            <Tree
                showIcon
                defaultExpandAll
                switcherIcon={<Icon type='caret-down' />}
                onSelect={this.chooseNode}
            >
                <TreeNode icon={<Icon type='folder-open' />} title='根目录' key='0-0'>
                    {treeNode}
                </TreeNode>
            </Tree>
        )
    }
}

export default TreeDom