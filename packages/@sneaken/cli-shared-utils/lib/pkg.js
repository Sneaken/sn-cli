const fs = require('fs')
const path = require('path')
// read-pkg version should < 6.0.0
const readPkg = require('read-pkg')

exports.resolvePkg = function (context) {
  if (fs.existsSync(path.join(context, 'package.json'))) {
    return readPkg.sync({ cwd: context })
  }
  return {}
}
