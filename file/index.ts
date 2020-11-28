/**
 * 根据文件名获取文件名和文件后缀
 * @param filename 
 */
export const splitFileNameParts = (filename: string) => {
    // .gitignore 之类 .开头的文件名
    if (filename[0] === '.') {
      return [filename];
    }
  
    // 使用 lastIndexOf 是为了处理拥有两个或以上.数量的文件名，如 webpack.config.js
    const splitIndex = filename.lastIndexOf('.');
    return [filename.slice(0, splitIndex), filename.slice(splitIndex)];
  };