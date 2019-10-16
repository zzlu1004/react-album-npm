## Install

```
npm i qm-ablum-react
```

## Api

```
multiple：boolean类型；默认值false，是否开启多选
getImgs: function(val)；val为图片库抛出的数据

```


## Usage

```
import Album from 'qm-ablum-react'

openAlbum() {
    this.refs.Album.openAlbum()
}

getImgs(val) {
    console.log(val)
}

render() {
    return (
        <div>
            <span onClick={this.openAlbum}>打开图库</span>
            <Album ref='Album' getImgs={this.getImgs}  multiple={false} />
        </div>
    )
}

```