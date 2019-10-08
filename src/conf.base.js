module.exports = {
  /**
   * 环境变量
   */
  env: {
  
  },
  /**
   * 小程序 app.json
   */
  app: {
    pages: [
      'pages/index'
    ],
    networkTimeout: {
      'request': 60000,
      'connectSocket': 10000,
      'uploadFile': 50000,
      'downloadFile': 50000
    },
    window: {
      'backgroundTextStyle': 'light',
      'navigationBarBackgroundColor': '#fff',
      'navigationBarTextStyle': 'black',
      'backgroundColor': '#EFEFF4'
    },
    usingComponents: {
     
    },
    functionalPages: {
      'independent': true
    },
    debug: false,
    sitemapLocation: 'sitemap.json',
    permission: {
      
    }
  },
  /**
   * 小程序 ext.json
   */
  ext: {

  },
  /**
   * 小程序project.config.json
   */
  project: {
    projectname: 'xc-mp-cli',
    description: '项目配置文件',
    setting: {
      urlCheck: true,
      es6: true,
      enhance: true,
      postcss: true,
      minified: true,
      newFeature: true,
      coverView: true,
      nodeModules: true,
      autoAudits: false,
      checkInvalidKey: true,
      checkSiteMap: true,
      uploadWithSourceMap: true,
      babelSetting: {
        ignore: [],
        disablePlugins: [],
        outputPath: ''
      }
    },
    compileType: 'miniprogram',
    scripts: {
      beforeCompile: '',
      beforePreview: '',
      beforeUpload: ''
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
      game: {
        list: []
      },
      miniprogram: {
        current: -1,
        list: []
      }
    }
  }
}
