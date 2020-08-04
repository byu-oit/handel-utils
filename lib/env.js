const serviceList = exports.serviceList = {
  dynamodb: { vars: ['TABLE_NAME', 'TABLE_ARN'] },
  efs: { vars: ['MOUNT_DIR'] },
  memcached: { vars: ['ADDRESS', 'PORT'] },
  mysql: { vars: ['ADDRESS', 'PORT', 'USERNAME', 'DATABASE_NAME'] },
  postgresql: { vars: ['ADDRESS', 'PORT', 'USERNAME', 'DATABASE_NAME'] },
  redis: { vars: ['ADDRESS', 'PORT'] },
  s3: { vars: ['BUCKET_NAME', 'BUCKET_URL', 'REGION_ENDPOINT'] },
  sns: { vars: ['TOPIC_ARN', 'TOPIC_NAME'] },
  sqs: { vars: ['QUEUE_NAME', 'QUEUE_URL', 'QUEUE_ARN'] }
}

const handelEnv = () => ({
  appName: process.env.HANDEL_APP_NAME,
  envName: process.env.HANDEL_ENVIRONMENT_NAME,
  serviceName: process.env.HANDEL_SERVICE_NAME,
  serviceVersion: process.env.HANDEL_SERVICE_VERSION,
  parameterStorePrefix: process.env.HANDEL_PARAMETER_STORE_PREFIX,
  parameterStorePath: process.env.HANDEL_PARAMETER_STORE_PATH
})

const resolveService = serviceKey => {
  const service = Object.keys(serviceList).find(k => k === serviceKey)
  if (service) {
    return serviceList[service]
  }
  throw new Error(`'${serviceKey}' is not a recognized handel service which exports environment variables!`)
}

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
  const variable = v.toUpperCase().replace(/-/g, '_')
  const itemName = i.toUpperCase().replace(/-/g, '_')
  const key = [itemName.toUpperCase(), resolveVariable(service, variable)].join('_')
  return process.env[key]
}

exports.getVariable = getVariable
exports.handelEnv = handelEnv
