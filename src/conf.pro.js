module.exports = {
  /**
   * 生产环境下环境变量
   */
  env: {
    NODE_ENV: 'pro'
  },
  app: {},
  ext: {
    'extEnable': true,
    'extAppid': '',
    'directCommit': false,
    ext: {}
  },
  project: {
    appid: '',
    setting: {
      'urlCheck': true,
      'es6': true,
      'postcss': true,
      'minified': true,
      'newFeature': true,
      'nodeModules': true,
      'autoAudits': false,
      'checkInvalidKey': true
    },
    condition: {
      search: {
        current: -1,
        list: []
      },
      conversation: {
        current: -1,
        list: []
      },
      plugin: {
        current: -1,
        list: []
      },
      game: {
        list: []
      },
      miniprogram: {
        current: 0,
        list: []
      }
    }
  }
}
