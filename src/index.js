const getYuqueClient = require('./yuque');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const url = require("url");

// todo: 为什么在正则里面要加两个斜杆？
const imageMDReg = new RegExp("!\\[(.+)\\]\\((.+)\\)", "g");
const hexoPostDir = '/Users/evilbs/work/blog/source/_posts'

/**
 * 将 yuque 文档转换成 hexo 文档
 * @param {yuque 文档信息} yuqueDoc 
 * @param {hexo posts 文件夹} hexoDir 
 * @param {转换设置参数} options 
 */
async function translateYuqueToHexo(yuqueDoc,
  hexoDir = hexoPostDir,
  options = {
    isSavedPicture: true,
    isForce: true
  }) {
  let result = {
    isSuccess: false,
    msg: ''
  };

  let client = getYuqueClient();
  let doc = await client.docs.get(yuqueDoc);
  let docPath = path.join(hexoDir, `${doc.slug}.md`);
  let docAssetPath = path.join(hexoDir, `${doc.slug}/`);
  let docContent;

  if (!options.isForce && fs.existsSync(docPath)) {
    result.msg = '此文章已经发布！';
    return result;
  }

  docContent = doc.body;
  result.title = doc.title;
  result.docPath = docPath;

  // 1. 图片转到本地
  if (options.isSavedPicture) {
    // 创建图片资源文件夹
    if (!fs.existsSync(docAssetPath)) {
      fs.mkdirSync(docAssetPath);
    }

    // 把远程图片下载到本地  
    let isDownloadedFiles = await downloadImages(docContent, docAssetPath);
    if (!isDownloadedFiles) {
      result.msg = '文章中的图片下载失败!';
      return result;
    }
  }

  // 2. 保存 md 到本地
  // todo: 这段代码怎么写会更加漂亮一点？
  docContent = `---
title: ${doc.title}
date: ${doc.created_at}
tags:
---
  ` + docContent;

  fs.writeFileSync(docPath, docContent, { encoding: 'utf-8' });

  result.isSuccess = true;
  return result;
}

/**
 * 下载所有 yuque 文档中的图片
 * @param {yuque 文档内容} docContent 
 * @param {文件存放地址} docAssetPath 
 */
async function downloadImages(docContent, docAssetPath) {
  let files = [];
  docContent = docContent.replace(imageMDReg, (match, imageAlt, imageSrc, offset, str) => {
    let urlParsed = url.parse(imageSrc);
    let fileName = path.basename(urlParsed.pathname);
    let filePath = path.join(docAssetPath, fileName);
    files.push({
      imageSrc,
      filePath,
      fileName
    });

    return `![${imageAlt}](${fileName})`;
  });

  for (var file of files) {
    await downloadImage(file.imageSrc, file.filePath);
  }

  return true;
}

/**
 * 将远程图片下载到本地
 * @param {图片 url} url 
 * @param {图片存放地址} imagePath 
 */
function downloadImage(url, imagePath) {
  return axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(imagePath))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}

module.exports = translateYuqueToHexo;
