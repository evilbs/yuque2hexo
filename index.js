const translateYuqueToHexo = require('./src');
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

/**
 * 主程序
 */
(async () => {
  const argv = yargs.command('y2h <yuquePath> <hexoDir>', '转换 yuque 文档到 hexo 文档', (yargs) => {
    yargs.positional('yuquePath', {
      describe: 'yuque 的路径，如 clientsec/uh6has/mqplpq ， 请不要带上网址: https://www.yuque.com/ .'
    }).positional('hexoDir', {
      describe: 'hexoDir 目录',
    });
  }).option('isForce', {
    alias: 'if',
    type: 'boolean',
    description: '当本地已经存在 yuque 文档时是否强制转换?'
  }).argv;

  let yuqueNamespace, slug, hexoDir;
  let yuquePaths = argv.yuquePath.split('/');
  if (yuquePaths.length != 3) {
    console.error('yuquePath 参数错误，请输入 clientsec/uh6has/mqplpq');
  }

  yuqueNamespace = `${yuquePaths[0]}/${yuquePaths[1]}`;
  slug = yuquePaths[2];
  hexoDir = argv.hexoDir;
  let yuqueDoc = {
    namespace: yuqueNamespace,
    slug: slug,
    data: {
      raw: 1
    }
  };
 
  let result = await translateYuqueToHexo(yuqueDoc, hexoDir);
  if(result.isSuccess){
    console.log(`转换成功\n标题: ${result.title}\n路径: ${result.docPath}`);
  }else{
    console.error(`转换成功\n标题: ${result.title}\n路径: ${result.docPath}`); 
  }
})();