exports.errorHandler = async (err, req, res, next) => {
  if (err === 'Unauthorized') {
    return res.status(401).json({ ok: false, m: 'You dont have authorized!'})
  }
  // if (err.message && err.message.search('validation failed') !== -1) {
  //   return res.status(500).json({ ok: false, m: 'Make sure to fill in the blank fields' })
  // }
  return res.status(500).json({ ok: false, m: err.message || err })
}