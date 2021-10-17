module.exports = function sortObject (obj, keyOrder, dontSortByUnicode) {
  if (!obj) return
  const res = {}

  if (keyOrder) {
    keyOrder.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = obj[key]
        delete obj[key]
      }
    })
  }

  // 当时定义的顺序
  const keys = Object.keys(obj)

  // sort 默认是以 unicode 排序的
  !dontSortByUnicode && keys.sort()
  keys.forEach(key => {
    res[key] = obj[key]
  })

  return res
}
