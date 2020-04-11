export default (arr, val) => {
  const newArr = [...arr]

  const idx = newArr.indexOf(val)
  if (idx >= 0) newArr.splice(idx, 1)
  else newArr.push(val)

  return newArr
}
