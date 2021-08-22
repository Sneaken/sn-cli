const modules = [
  'env',
  'exit',
  'ipc',
  'logger',
  'module',
  'object',
  'pkg',
  'pluginResolution',
  'pluginOrder',
  'request',
  'spinner',
  'validate'
]


modules.forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})

exports.chalk = require('chalk')
exports.execa = require('execa')
exports.semver = require('semver')

Object.defineProperty(exports, 'installedBrowsers', {
  enumerable: true,
  get () {
    return exports.getInstalledBrowsers()
  }
})


// 为什么使用 exports 而不是 module.exports
// 因为导入到方法都是不会被改变的
