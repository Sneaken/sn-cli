const inquirer = require('inquirer')
const {
  execa,
  warn,
  hasProjectGit
} = require('@sneaken/cli-shared-utils')

module.exports = async function confirmIfGitDirty (context) {
  if (process.env.SN_CLI_SKIP_DIRTY_GIT_PROMPT || process.env.SN_CLI_API_MODE) {
    return true
  }

  process.env.SN_CLI_SKIP_DIRTY_GIT_PROMPT = true

  if (!hasProjectGit(context)) {
    return true
  }

  // git 是否有没提交的记录 没有则正常
  const { stdout } = await execa('git', ['status', '--porcelain'], { cwd: context })
  if (!stdout) {
    return true
  }

  // 提示是否继续
  warn(`There are uncommitted changes in the current repository, it's recommended to commit or stash them first.`)
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: 'Still proceed?',
      default: false
    }
  ])
  return ok
}
