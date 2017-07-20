const test = require('tape')
const util = require('../index')
const AWS = require('./awsMock')
const BADAWS = require('./faultyAwsMock')

const testVars = {
  HANDEL_APP_NAME: 'test-app',
  HANDEL_ENVIRONMENT_NAME: 'dev',
  HANDEL_SERVICE_NAME: 'TestArtifact',
  HANDEL_SERVICE_VERSION: 'v1'
}
process.env = Object.assign({}, process.env, testVars)

test('Fetch Parameters', assert => {
  assert.plan(5)

  util.fetchParameters(AWS, ['myKey1', 'encryptedKey1']).then(actual => {
    const expected = {
      myKey1: 'MyValue1',
      encryptedKey1: 'EncryptedValue1'
    }
    assert.deepEqual(actual, expected, 'Correctly fetched parameters')
  })

  util.fetchParameters(AWS, ['myKey2', 'encryptedKey2', 'nested.key1']).then(actual => {
    const expected = {
      myKey2: 'MyValue2',
      encryptedKey2: 'EncryptedValue2',
      nested: {
        key1: 'NestedValue1'
      }
    }
    assert.deepEqual(actual, expected, 'Correctly fetched nested key')
  })

  util.fetchParameters(AWS, ['myKey1', 'myKey2', 'encryptedKey1', 'encryptedKey2']).then(actual => {
    const expected = {
      myKey1: 'MyValue1',
      encryptedKey1: 'EncryptedValue1',
      myKey2: 'MyValue2',
      encryptedKey2: 'EncryptedValue2'
    }
    assert.deepEqual(actual, expected, 'Correctly fetched all parameters')
  })

  util.fetchParameters(AWS, ['myKey1', 'invalidKey']).then(actual => {
    const expected = {
      myKey1: 'MyValue1',
      invalidKey: null
    }
    assert.deepEqual(actual, expected, 'Correctly fetched with invalid parameter')
  })

  util.fetchParameters(BADAWS, ['myKey1'])
  .then(data => {
    assert.fail('Didn\'t throw error with bad connection')
  })
  .catch(() => {
    assert.pass('Correctly throws error if bad connection')
  })
})
