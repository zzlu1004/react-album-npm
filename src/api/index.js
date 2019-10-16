import fetch from '../utils/fetch.js'

/**
 * 相册目录
 */
export function getAlbumCategory() {
    return fetch({
        url: 'coroutine/picture/category/lists',
        method: 'GET'
    })
}
/**
 * 获取对应目录的图片
 */
export function getPictureDirListData(params) {
    return fetch({
        url: 'coroutine/picture/file/lists',
        method: 'GET',
        params
    })
}

/**
 * 添加分组
 * @param {*父级} pid
 * @param {*分组名称} name
 */
export function addAlbumCategory(pid, name) {
    const data = {
        pid, name
    }
    return fetch({
        url: '/coroutine/picture/category/create',
        method: 'post',
        data
    })
}

/**
 * 根据ID修改分组名称
 * @param {*分组ID} id
 */
export function editAlbumCategoryById(id, name) {
    const data = {
        id, name
    }
    return fetch({
        url: '/coroutine/picture/category/editor',
        method: 'post',
        data
    })
}

/**
 * 根据ID删除分组
 * *如果分组下含有信息，则删除失败
 * @param {*分组ID} id
 */
export function delAlbumCategoryById(id) {
    const data = {
        id,
        _method: 'DELETE'
    }
    return fetch({
        url: '/coroutine/picture/category/remove',
        method: 'POST',
        data
    })
}

/**
 * 修改图片信息
 * * @param {*图片id} id
 * * @param {*图片名称} name
 * * @param {*图片描述} description
 */
export function editAlbumById(id, name, description) {
    const data = {
        id, name, description
    }
    return fetch({
        url: '/coroutine/picture/file/desc',
        method: 'POST',
        data
    })
}

/**
 * 批量删除图片
 * @param {*IDS} ids
 */
export function delPictureByIds(ids) {
    const data = {
        ids,
        _method: 'DELETE'
    }
    return fetch({
        url: '/coroutine/picture/file/remove',
        method: 'POST',
        data
    })
}

/**
 * 移动图片
 * @param {*移动文件的ID} id
 * @param {*分组（目标）ID} cid
 */
export function movePictureByIds(ids, cid) {
    const data = {
        ids, cid
    }
    return fetch({
        url: '/coroutine/picture/file/move',
        method: 'POST',
        data
    })
}

/**
 * 获取官方图片库分类
 * @param {*分组ID} pid
 */
export function publicPictureCategory() {
    return fetch({
        url: '/coroutine/picture/common/cat-list',
        method: 'GET'
    })
}

/**
 * 获取官方图片库
 */
export function publicPictureList(params) {
    return fetch({
        url: '/coroutine/picture/common/file-list',
        method: 'GET',
        params
    })
}
