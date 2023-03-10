/**
 * 规范化 options 配置暂时不处理
 *
 * @param {WebpackOptions} config input config
 * @return {WebpackOptionsNormalized} normalized options
 */
const getNormalizedWebpackOptions = (config) => {
  return {
    amd: config.amd,
    bail: config.bail,
  };
};
exports.getNormalizedWebpackOptions = getNormalizedWebpackOptions;
