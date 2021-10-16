const program = require('commander')
const { chalk } = require('@sneaken/cli-shared-utils')

module.exports = (methodName, log) => {
  program.Command.prototype[methodName] = function (...args) {
    // 这边的 this 说的是 program.Command
    // 默认情况下，使用未知选项会提示错误。
    // 所以如要将未知选项视作普通命令参数，并继续处理其他部分，需要调用 allowUnknownOption()
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    // 只展示帮助信息，不退出程序。
    this.outputHelp()
    console.log(`  ` + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}
