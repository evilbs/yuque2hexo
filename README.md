## 语雀文档转换成 hexo 文档工具

本工具目地是使用「语雀」作为 hexo 文章编辑器，同时把「语雀」编辑好的文章和文章里的图片通过工具转换成 hexo 文章。
带来的好处是，你可能通过「语雀」编辑器带来的所见即所得的用户体验，你不需要再通过手写 markdown 来完成文章书写，同时文章中插入图片更加方便。

### Features

1. 保存「语雀」上的文档到本地。
2. 同步「语雀」文档中的图片到本地。


### 使用方法
1. npm install -g yuque2hexo
1. 在 yuque.com 中获取 token。[地址](https://www.yuque.com/settings/tokens/new)。
2. 运行 y2h translate &lt;yuquePath&gt; &lt;hexoPostsDir&gt; &lt;yuqueToken&gt;