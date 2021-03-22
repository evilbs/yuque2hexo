const fs = require('fs');
const path = require('path');
const axios = require('axios');
const URL = require('url');

const IMAGEMDREG = /!\[(.+?)\]\((.+?)\)/g;

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
    (response) => new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(imagePath))
        .on('finish', () => resolve())
        .on('error', (e) => reject(e));
    }),
  );
}

/**
 * 下载所有 yuque 文档中的图片
 * @param {yuque 文档内容} docContent
 * @param {文件存放地址} docAssetPath
 */
async function downloadImages(docContent, docAssetPath) {
  const files = [];
  const content = docContent.replace(IMAGEMDREG, (match, imageAlt, imageSrc) => {
    const urlParsed = URL.parse(imageSrc);
    const fileName = path.basename(urlParsed.pathname);
    const filePath = path.join(docAssetPath, fileName);
    files.push({
      imageSrc,
      filePath,
      fileName,
    });

    return `![${imageAlt}](${fileName})`;
  });

  const promises = [];
  files.forEach((file) => {
    promises.push(downloadImage(file.imageSrc, file.filePath));
  });

  await Promise.all(promises);
  return content;
}

module.exports = {
  downloadImages,
  downloadImage,
};
