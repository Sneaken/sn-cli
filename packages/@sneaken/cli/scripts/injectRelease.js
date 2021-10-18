const path = require('path');
const fs = require('fs-extra');
const { log, execa } = require('@sneaken/cli-shared-utils');
const getPkg = require('../lib/util/getPkg');
const ProjectPackageManager = require('../lib/util/ProjectPackageManager');

const devDependencies = {
  '@commitlint/cli': '^13.2.0',
  '@commitlint/config-conventional': '^13.2.0',
  '@craco/craco': '^6.3.0',
  chalk: '^4.1.2',
  commitizen: '^4.2.4',
  'conventional-changelog-cli': '^2.1.1',
  'cz-conventional-changelog': '^3.3.0',
  enquirer: '^2.3.6',
  execa: '^5.1.1',
  eslint: '^7.30.0',
  husky: '^7.0.2',
  'lint-staged': '^11.1.2',
  minimist: '^1.2.5',
  prettier: '^2.4.1',
  semver: '^7.3.5',
};

module.exports = async () => {
  const pm = new ProjectPackageManager();
  const projectRootPath = process.cwd();
  const pkg = getPkg(projectRootPath);
  pkg.devDependencies = {
    ...pkg.devDependencies,
    ...devDependencies,
  };
  log(`📦  writing devDependencies...`);
  log();

  log(`📦  writing some scripts...`);
  log();
  pkg.scripts = {
    ...pkg.scripts,
    release: 'node scripts/release.js',
    changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s',
    commit: 'git-cz',
    prepare: 'husky install',
  };

  log(`📦  writing lint-staged...`);
  log();
  pkg['lint-staged'] = {
    ...pkg['lint-staged'],
    'lint-staged': {
      '!(docs/**/*).js': ['prettier --write'],
      '*.ts?(x)': ['eslint', 'prettier --parser=typescript --write'],
    },
  };

  log(`📦  writing commitizen config...`);
  log();
  pkg.config = {
    ...pkg.config,
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  };

  const filePath = path.join(projectRootPath, 'package.json');
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));

  log(`📦  Installing additional devDependencies...`);
  log();
  await pm.install();
  execa.commandSync('yarn run prepare');

  log(`📦  writing husky scripts...`);

  const { stdout: preCommitStdout } = execa.sync(
    'yarn',
    ['husky', 'add', '.husky/pre-commit', 'yarn lint-staged "$1"'],
    {
      execPath: projectRootPath,
    },
  );
  log(preCommitStdout);
  log();

  const { stdout: commitMsgStdout } = execa.sync(
    'yarn',
    ['husky', 'add', '.husky/commit-msg', 'yarn commitlint --edit "$1"'],
    {
      execPath: projectRootPath,
      stdout: 'pipe',
    },
  );
  log(commitMsgStdout);
  log()
};
