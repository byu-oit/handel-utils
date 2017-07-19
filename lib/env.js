const serviceList = exports.serviceList = {
  dynamodb: { prefix: 'DYNAMODB', vars: [ 'TABLE_NAME', 'TABLE_ARN' ] },
  efs: { prefix: 'EFS', vars: [ 'MOUNT_DIR' ] },
  memcached: { prefix: 'MEMCACHED', vars: [ 'ADDRESS', 'PORT' ] },
  mysql: { prefix: 'MYSQL', vars: [ 'ADDRESS', 'PORT', 'USERNAME', 'DATABASE_NAME' ] },
  postgresql: { prefix: 'POSTGRESQL', vars: [ 'ADDRESS', 'PORT', 'USERNAME', 'DATABASE_NAME' ] },
  redis: { prefix: 'REDIS', vars: [ 'ADDRESS', 'PORT' ] },
  s3: { prefix: 'S3', vars: [ 'BUCKET_NAME', 'BUCKET_URL', 'REGION_ENDPOINT' ] },
  sns: { prefix: 'SNS', vars: [ 'TOPIC_ARN', 'TOPIC_NAME' ] },
  sqs: { prefix: 'SQS', vars: [ 'QUEUE_NAME', 'QUEUE_URL', 'QUEUE_ARN' ] }
}

const handelEnv = () => ({
  appName: process.env.HANDEL_APP_NAME,
  envName: process.env.HANDEL_ENVIRONMENT_NAME,
  serviceName: process.env.HANDEL_SERVICE_NAME,
  serviceVersion: process.env.HANDEL_SERVICE_VERSION
})

const partialPrefix = () => {
  const {appName, envName} = handelEnv()
  const transform = s => s.toUpperCase().replace(/-/g, '_')
  return [transform(appName), transform(envName)].join('_')
}

const resolveService = serviceKey => {
  const service = Object.keys(serviceList).find(k => k === serviceKey)
  if (service) {
    return serviceList[service]
  }
  throw new Error(`'${serviceKey}' is not a recognized handel service which exports environment variables!`)
}

const servicePrefix = serviceKey => resolveService(serviceKey).prefix

const servicePartialPrefix = service => [servicePrefix(service), partialPrefix()].join('_')

const resolveVariable = (serviceKey, variable) => {
  const service = resolveService(serviceKey)
  const resolvedVar = service.vars.find(v => v === variable)
  if (!resolvedVar) {
    throw new Error(`'${variable}' is not a recognized handel variable for the ${serviceKey} service!`)
  }
  return resolvedVar
}

const getVariable = (s, i, v) => {
  if (typeof i !== 'string') {
    throw new Error('Expected the configuration item name to be passed as a string!')
  }
  const service = s.toLowerCase()
  const variable = v.toUpperCase()
  const itemName = i.toUpperCase()
  const key = [ servicePartialPrefix(service), itemName.toUpperCase(), resolveVariable(service, variable) ].join('_')
  return process.env[key]
}

exports.getVariable = getVariable
exports.handelEnv = handelEnv
exports.partialPrefix = partialPrefix
exports.servicePartialPrefix = servicePartialPrefix
