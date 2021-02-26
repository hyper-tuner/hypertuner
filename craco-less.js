const path = require('path');
const { getLoader, loaderByName, throwUnexpectedConfigError } = require('@craco/craco');

const overrideWebpackConfig = ({ context, webpackConfig, pluginOptions }) => {
  const throwError = (message, githubIssueQuery) =>
    throwUnexpectedConfigError({
      packageName: 'craco-less',
      githubRepo: 'DocSpring/craco-less',
      message,
      githubIssueQuery,
    });

  const lessExtension = /\.less$/;
  const options = pluginOptions || {};
  const pathSep = path.sep;

  const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
  if (!oneOfRule) {
    throwError(
      'Can\'t find a \'oneOf\' rule under module.rules in the ' +
      `${context.env} webpack config!`,
      'webpack+rules+oneOf',
    );
  }

  const sassRule = oneOfRule.oneOf.find(
    rule => rule.test && rule.test.toString().includes('scss|sass'),
  );
  if (!sassRule) {
    throwError(
      'Can\'t find the webpack rule to match scss/sass files in the ' +
      `${context.env} webpack config!`,
      'webpack+rules+scss+sass',
    );
  }
  let lessRule = {
    exclude: /\.module\.(less)$/,
    test: lessExtension,
    use: [],
  };

  const loaders = sassRule.use;
  loaders.forEach(ruleOrLoader => {
    let rule;
    if (typeof ruleOrLoader === 'string') {
      rule = {
        loader: ruleOrLoader,
        options: {},
      };
    } else {
      rule = ruleOrLoader;
    }

    if (
      (context.env === 'development' || context.env === 'test') &&
      rule.loader.includes(`${pathSep}style-loader${pathSep}`)
    ) {
      lessRule.use.push({
        loader: rule.loader,
        options: {
          ...rule.options,
          ...(options.styleLoaderOptions || {}),
        },
      });
    } else if (rule.loader.includes(`${pathSep}css-loader${pathSep}`)) {
      lessRule.use.push({
        loader: rule.loader,
        options: {
          ...rule.options,
          ...(options.cssLoaderOptions || {}),
        },
      });
    } else if (rule.loader.includes(`${pathSep}postcss-loader${pathSep}`)) {
      lessRule.use.push({
        loader: rule.loader,
        options: {
          ...rule.options,
          ...(options.postcssLoaderOptions || {}),
        },
      });
    } else if (rule.loader.includes(`${pathSep}resolve-url-loader${pathSep}`)) {
      lessRule.use.push({
        loader: rule.loader,
        options: {
          ...rule.options,
          ...(options.resolveUrlLoaderOptions || {}),
        },
      });
    } else if (
      context.env === 'production' &&
      rule.loader.includes(`${pathSep}mini-css-extract-plugin${pathSep}`)
    ) {
      lessRule.use.push({
        loader: rule.loader,
        options: {
          ...rule.options,
          ...(options.miniCssExtractPluginOptions || {}),
        },
      });
    } else if (rule.loader.includes(`${pathSep}sass-loader${pathSep}`)) {
      const defaultLessLoaderOptions =
        context.env === 'production' ? { sourceMap: true } : {};
      lessRule.use.push({
        loader: require.resolve('less-loader'),
        options: {
          ...defaultLessLoaderOptions,
          ...options.lessLoaderOptions,
        },
      });
    } else {
      throwError(
        `Found an unhandled loader in the ${context.env} webpack config: ${rule.loader}`,
        'webpack+unknown+rule',
      );
    }
  });

  if (options.modifyLessRule) {
    lessRule = options.modifyLessRule(lessRule, context);
  }
  oneOfRule.oneOf.push(lessRule);

  const { isFound, match: fileLoaderMatch } = getLoader(
    webpackConfig,
    loaderByName('file-loader'),
  );
  if (!isFound) {
    throwError(
      `Can't find file-loader in the ${context.env} webpack config!`,
      'webpack+file-loader',
    );
  }
  fileLoaderMatch.loader.exclude.push(lessExtension);

  return webpackConfig;
};

module.exports = {
  overrideWebpackConfig,
};
