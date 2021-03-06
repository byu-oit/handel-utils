'use strict'
const _ = require('lodash')
const env = require('./env')

const fetchParams = (AWS, Names, fixKey) => {
  const params = { WithDecryption: true, Names }
  const ssm = new AWS.SSM({ apiVersion: '2014-11-06' })
  return ssm.getParameters(params).promise().then(data => {
    const foundKeys = data.Parameters.map(p => p.Name)
    const notFoundKeys = data.InvalidParameters.slice()
    var results = {}
    foundKeys.reduce((o, k) => {
      const parm = data.Parameters.find(pk => pk.Name === k)
      _.set(o, fixKey(k), parm.Value)
      return o
    }, results)
    notFoundKeys.reduce((o, k) => {
      _.set(o, fixKey(k), null)
      return o
    }, results)
    return results
  },
  err => {
    throw new Error('ErrorCalling SSM.getParameters! Original message: ' + err)
  })
}

exports.fetchParameters = (AWS, keyList) => {
  const handelEnv = env.handelEnv()
  const prefix = handelEnv.parameterStorePrefix
  const Names = keyList.map(k => [prefix, k].join('.'))
  const fixKey = k => k.replace(`${prefix}.`, '').split('.')
  return fetchParams(AWS, Names, fixKey)
}

exports.fetchParametersByPath = (AWS, keyList) => {
  const handelEnv = env.handelEnv()
  const prefix = handelEnv.parameterStorePath
  const Names = keyList.map(k => [prefix, k].join(''))
  const fixKey = k => k.replace(`${prefix}`, '').split('/')
  return fetchParams(AWS, Names, fixKey)
}
