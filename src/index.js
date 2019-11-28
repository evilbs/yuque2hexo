const path = require('path');
const fs = require('fs');
const { downloadImages } = require('./utils');
const getYuqueClient = require('./yuque');

/**
 * 将 yuque 文档转换成 hexo 文档
 * @param {yuque token} yuqueToken
 * @param {yuque 文档信息} yuqueDoc
 * @param {hexo posts 文件夹} hexoDir
 * @param {转换设置参数} options
 */
async function translateYuqueToHexo(yuqueToken, yuqueDoc, hexoDir,
  options = { isSavedPicture: true, isForce: true }) {
  const result = {
    isSuccess: false,
    msg: '',
  };

  const client = getYuqueClient(yuqueToken);
  let doc;
  try {
    doc = await client.docs.get(yuqueDoc);
  } catch (e) {
    let msg = '语雀文章获取失败，';
    if (e.status === 401) {
      msg += '请查检「语雀」token 是否配置正确.';
    } else {
      msg = (e.message === 'Not Found' ? '文章不存在.' : '请检查是否为网络原因.');
    }
    result.msg = msg;
    return result;
  }

  const docPath = path.join(hexoDir, `${doc.slug}.md`);
  const docAssetPath = path.join(hexoDir, `${doc.slug}/`);
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
    try {
      docContent = await downloadImages(docContent, docAssetPath);
    } catch (e) {
      result.msg = `文章中的图片下载失败，${e.message}`;
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
${docContent}`;

  fs.writeFileSync(docPath, docContent, { encoding: 'utf-8' });
  result.isSuccess = true;
  return result;
}


module.exports = translateYuqueToHexo;
