const yargs = require('yargs');
const translateYuqueToHexo = require('./src');
require('colors');

/**
 * 主程序
 */
async function main() {
  const { argv } = yargs.usage('Usage: $0 <command> [options]')
    .command('translate <yuquePath> <hexoPostsDir> <yuqueToken>', '转换 yuque 文档到 hexo 文档', (yargsIns) => {
      yargsIns.positional('yuquePath', {
        description: 'yuque 的路径，如 clientsec/uh6has/mqplpq，请不要带上网址: https://www.yuque.com/ .',
      }).positional('hexoPostsDir', {
        description: '本地 hexo posts 目录',
      }).positional('yuqueToken', {
        description: 'yuque 的 token，请在 yuque.com 上配置并获取，地址：https://www.yuque.com/settings/tokens/new.',
      });
    })
    .option('isForce', {
      alias: 'if',
      type: 'boolean',
      description: '当本地已经存在 yuque 文档时是否强制转换?',
    })
    .demandOption(['yuquePath'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2019');

  if (!argv.yuquePath) {
    return;
  }

  const yuquePaths = argv.yuquePath.split('/');
  if (yuquePaths.length !== 3) {
    console.error('yuquePath 参数错误，请输入 clientsec/uh6has/mqplpq');
  }

  const yuqueNamespace = `${yuquePaths[0]}/${yuquePaths[1]}`;
  const slug = yuquePaths[2];
  const yuqueDoc = {
    namespace: yuqueNamespace,
    slug,
    data: {
      raw: 1,
    },
  };

  const result = await translateYuqueToHexo(argv.yuqueToken, yuqueDoc, argv.hexoPostsDir);
  if (result.isSuccess) {
    console.log(`转换成功\n标题: ${result.title}\n路径: ${result.docPath}`.green);
  } else {
    console.log(`转换失败\n原因: ${result.msg}`.red);
  }
}

module.exports = main;
