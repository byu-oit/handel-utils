'use strict'
const parmStore = {
  'test-app.dev.myKey1': 'MyValue1',
  'test-app.dev.myKey2': 'MyValue2',
  'test-app.dev.encryptedKey1': 'EncryptedValue1',
  'test-app.dev.encryptedKey2': 'EncryptedValue2',
  'test-app.dev.nested.key1': 'NestedValue1',
  '/test-app/dev/myKey3': 'MyValue3',
  '/test-app/dev/myKey4': 'MyValue4',
  '/test-app/dev/encryptedKey3': 'EncryptedValue3',
  '/test-app/dev/encryptedKey4': 'EncryptedValue4',
  '/test-app/dev/nested/key2': 'NestedValue2'
}

const getParameters = params => {
  const promise = () => Promise.resolve(
    params.Names.reduce((o, n) => {
      const foundKey = Object.keys(parmStore).find(k => k === n)
      if (foundKey) {
        o.Parameters.push({
          Name: n,
          Type: /encrypted/.test(n) ? 'SecureString' : 'String',
          Value: parmStore[n]
        })
      } else {
        o.InvalidParameters.push(n)
      }
      return o
    }, { Parameters: [], InvalidParameters: [] })
  )
  return { promise }
}

exports.SSM = function (version) {
  this.getParameters = getParameters
}
