const style = styles =>
  Object.keys(styles)
    .filter(styleName => styles[styleName])
    .join(' ')
    .trim()

export default style
