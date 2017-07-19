const test = require('tape')
const util = require('../index')

const testVars = {
  HANDEL_APP_NAME: 'test-app',
  HANDEL_ENVIRONMENT_NAME: 'dev',
  HANDEL_SERVICE_NAME: 'TestArtifact',
  HANDEL_SERVICE_VERSION: 'v1',
  DYNAMODB_TEST_APP_DEV_MYTABLE_TABLE_NAME: 'mytable',
  DYNAMODB_TEST_APP_DEV_MYTABLE_TABLE_ARN: 'arn:faketestvaluefortable',
  EFS_TEST_APP_DEV_MYEFS_MOUNT_DIR: '/fake/mountdir',
  MEMCACHED_TEST_APP_DEV_MYELASTICACHE_ADDRESS: 'my_cache.fake.com',
  MEMCACHED_TEST_APP_DEV_MYELASTICACHE_PORT: '9999',
  MYSQL_TEST_APP_DEV_MYDB_ADDRESS: 'my_db.fake.com',
  MYSQL_TEST_APP_DEV_MYDB_PORT: '8888',
  MYSQL_TEST_APP_DEV_MYDB_USERNAME: 'fakeuser',
  MYSQL_TEST_APP_DEV_MYDB_DATABASE_NAME: 'fakedb',
  POSTGRESQL_TEST_APP_DEV_MYDB_ADDRESS: 'my_db2.fake.com',
  POSTGRESQL_TEST_APP_DEV_MYDB_PORT: '8989',
  POSTGRESQL_TEST_APP_DEV_MYDB_USERNAME: 'fakeuser2',
  POSTGRESQL_TEST_APP_DEV_MYDB_DATABASE_NAME: 'fakedb2',
  REDIS_TEST_APP_DEV_MYCACHE_ADDRESS: 'my_cache2.fake.com',
  REDIS_TEST_APP_DEV_MYCACHE_PORT: '9898',
  S3_TEST_APP_DEV_MYBUCKET_BUCKET_NAME: 'my_bucket',
  S3_TEST_APP_DEV_MYBUCKET_BUCKET_URL: 'my_bucket.fake.com',
  S3_TEST_APP_DEV_MYBUCKET_REGION_ENDPOINT: 'us-west-2',
  SNS_TEST_APP_DEV_MYTOPIC_TOPIC_ARN: 'arn:faketestvaluefortopic',
  SNS_TEST_APP_DEV_MYTOPIC_TOPIC_NAME: 'testtopic',
  SQS_TEST_APP_DEV_MYQUEUE_QUEUE_NAME: 'myqueue',
  SQS_TEST_APP_DEV_MYQUEUE_QUEUE_URL: 'my_queue.fake.com',
  SQS_TEST_APP_DEV_MYQUEUE_QUEUE_ARN: 'arn:faketestvalueforqueue'
}
process.env = Object.assign({}, process.env, testVars)

const serviceList = [
  'dynamodb',
  'efs',
  'memcached',
  'mysql',
  'postgresql',
  'redis',
  's3',
  'sns',
  'sqs'
]

test('Handel Environment', assert => {
  const actual = util.handelEnv()
  const expected = {
    appName: 'test-app',
    envName: 'dev',
    serviceName: 'TestArtifact',
    serviceVersion: 'v1'
  }
  assert.deepEqual(actual, expected, 'Correctly loaded handel common variables')
  assert.end()
})

test('Partial Environment Prefix', assert => {
  const actual = util.partialPrefix()
  const expected = 'TEST_APP_DEV'
  assert.equal(actual, expected, 'Correctly generated a partial environmental prefix')
  assert.end()
})

test('Each service prefix', assert => {
  assert.plan(serviceList.length)
  serviceList.forEach(service => {
    const actual = util.servicePartialPrefix(service)
    const expected = `${service.toUpperCase()}_TEST_APP_DEV`
    assert.equal(actual, expected, `${service} service prefix generated correctly`)
  })
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

  assert.throws(() => util.getVariable('invalid', 'ITEM', 'VAR_NAME'), /is not a recognized handel service/, 'Expected invalid service name to throw an error')

  assert.throws(() => util.getVariable('s3', 3, 'VAR_NAME'), /Expected the configuration/, 'Expected invalid configuration item name to throw an error')

  assert.throws(() => util.getVariable('s3', 'MYBUCKET', 'VAR_NAME'), /not a recognized handel variable/, 'Expected invalid variable name to throw an error')

  assert.end()
})
