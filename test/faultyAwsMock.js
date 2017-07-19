'use strict'

const getParameters = params => {
  const promise = () => new Promise((resolve, reject) => {
    return reject(new Error('No Connection'))
  })
  return { promise }
}

exports.SSM = function (version) {
  this.getParameters = getParameters
}
