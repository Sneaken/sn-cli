module.exports = async function run (name) {
  require(`../scripts/${name}`)()
}
