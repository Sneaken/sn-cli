const pluginRE = /^(@sn\/|sn-|@[\w-]+(\.)?[\w-]+\/sn-)cli-plugin-/
const scopeRE = /^@[\w-]+(\.)?[\w-]+\//
const officialRE = /^@sn\//

const officialPlugins = [
  'babel',
  'eslint',
  'pwa',
  'router',
  'typescript',
  'webpack-4'
]

exports.isPlugin = id => pluginRE.test(id)

exports.isOfficialPlugin = id => exports.isPlugin(id) && officialRE.test(id)

exports.toShortPluginId = id => id.replace(pluginRE, '')

exports.resolvePluginId = id => {
  // already full id
  // e.g. sn-cli-plugin-foo, @sn/cli-plugin-foo, @bar/sn-cli-plugin-foo
  if (pluginRE.test(id)) {
    return id
  }

  if (id === '@sn/cli-service') {
    return id
  }

  if (officialPlugins.includes(id)) {
    return `@sn/cli-plugin-${id}`
  }
  // scoped short
  // e.g. @sn/foo, @bar/foo
  if (id.charAt(0) === '@') {
    const scopeMatch = id.match(scopeRE)
    if (scopeMatch) {
      const scope = scopeMatch[0]
      const shortId = id.replace(scopeRE, '')
      return `${scope}${scope === '@sn/' ? `` : `sn-`}cli-plugin-${shortId}`
    }
  }
  // default short
  // e.g. foo
  return `sn-cli-plugin-${id}`
}

exports.matchesPluginId = (input, full) => {
  const short = full.replace(pluginRE, '')
  return (
    // input is full
    full === input ||
    // input is short without scope
    short === input ||
    // input is short with scope
    short === input.replace(scopeRE, '')
  )
}

exports.getPluginLink = id => {
  if (officialRE.test(id)) {
    return `https://github.com/Sneaken/sn-cli/tree/master/packages/%40sn/cli-plugin-${
      exports.toShortPluginId(id)
    }`
  }
  let pkg = {}
  try {
    pkg = require(`${id}/package.json`)
  } catch (e) {}
  return (
    pkg.homepage ||
    (pkg.repository && pkg.repository.url) ||
    `https://www.npmjs.com/package/${id.replace(`/`, `%2F`)}`
  )
}
