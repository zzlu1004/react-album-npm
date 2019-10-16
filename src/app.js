import React from 'react';
import ReactDOM from 'react-dom';

import Album from './component/index.js'

/**
 * @qaram {Boolean} multiple 是否支持多选
 * @qaram {Array} currentImgs 选中图片，目前单选和多选时，统一返回数组
 */

function getImgs(val) {
    console.log(val)  
}

ReactDOM.render(
    <Album multiple={true} getImgs={getImgs} />, 
    document.getElementById('root')
)
