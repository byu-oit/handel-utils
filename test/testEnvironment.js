const test = require('tape')
const util = require('../index')

const testVars = {
  HANDEL_APP_NAME: 'test-app',
  HANDEL_ENVIRONMENT_NAME: 'dev',
  HANDEL_SERVICE_NAME: 'TestArtifact',
  HANDEL_SERVICE_VERSION: 'v1',
  HANDEL_PARAMETER_STORE_PREFIX: 'test-app.dev',
  MY_TABLE_TABLE_NAME: 'mytable',
  MY_TABLE_TABLE_ARN: 'arn:faketestvaluefortable',
  MYEFS_MOUNT_DIR: '/fake/mountdir',
  MYELASTICACHE_ADDRESS: 'my_cache.fake.com',
  MYELASTICACHE_PORT: '9999',
  MYDB_ADDRESS: 'my_db.fake.com',
  MYDB_PORT: '8888',
  MYDB_USERNAME: 'fakeuser',
  MYDB_DATABASE_NAME: 'fakedb',
  MYDB2_ADDRESS: 'my_db2.fake.com',
  MYDB2_PORT: '8989',
  MYDB2_USERNAME: 'fakeuser2',
  MYDB2_DATABASE_NAME: 'fakedb2',
  MYCACHE_ADDRESS: 'my_cache2.fake.com',
  MYCACHE_PORT: '9898',
  MYBUCKET_BUCKET_NAME: 'my_bucket',
  MYBUCKET_BUCKET_URL: 'my_bucket.fake.com',
  MYBUCKET_REGION_ENDPOINT: 'us-west-2',
  MYTOPIC_TOPIC_ARN: 'arn:faketestvaluefortopic',
  MYTOPIC_TOPIC_NAME: 'testtopic',
  MYQUEUE_QUEUE_NAME: 'myqueue',
  MYQUEUE_QUEUE_URL: 'my_queue.fake.com',
  MYQUEUE_QUEUE_ARN: 'arn:faketestvalueforqueue'
}
process.env = Object.assign({}, process.env, testVars)

test('Handel Environment', assert => {
  const actual = util.handelEnv()
  const expected = {
    appName: 'test-app',
    envName: 'dev',
    serviceName: 'TestArtifact',
    serviceVersion: 'v1',
    parameterStorePrefix: 'test-app.dev'
  }
  assert.deepEqual(actual, expected, 'Correctly loaded handel common variables')
  assert.end()
})

test('Service variable', assert => {
  {
    const actual = util.getVariable('s3', 'MYBUCKET', 'BUCKET_NAME')
    const expected = 'my_bucket'
    assert.equal(actual, expected, 'Correctly retrieved a variable')
  }

  {
    const actual = util.getVariable('s3', 'MyBucket', 'bucket_name')
    const expected = 'my_bucket'
    assert.equal(actual, expected, 'Correctly retrieved a variable with lowercase parameters')
  }

  {
    const actual = util.getVariable('dynamodb', 'my-table', 'table_name')
    const expected = 'mytable'
    assert.equal(actual, expected, 'Correctly retrieve a variable with dashes')
  }

  assert.throws(() => util.getVariable('invalid', 'ITEM', 'VAR_NAME'), /is not a recognized handel service/, 'Expected invalid service name to throw an error')

  assert.throws(() => util.getVariable('s3', 3, 'VAR_NAME'), /Expected the configuration/, 'Expected invalid configuration item name to throw an error')

  assert.throws(() => util.getVariable('s3', 'MYBUCKET', 'VAR_NAME'), /not a recognized handel variable/, 'Expected invalid variable name to throw an error')

  assert.end()
})
