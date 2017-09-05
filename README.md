# handel-utils
Utility library for apps deployed using [handel](https://github.com/byu-oit/handel) and
[handel-codepipeline](https://github.com/byu-oit/handel-codepipeline)

# Environment Variables
Functions to deal with environment variables injected by Handel

## getVariable
Retrieves the value of an environment variable injected by Handel

Parameters:
- `serviceType`: the type of the service exporting the variable (for example `'s3'`)
    The valid service types are:
    - dynamodb
    - efs
    - memcached
    - mysql
    - postgresql
    - redis
    - s3
    - sns
    - sqs

- `serviceName`: the name of the service as configured in your `handel.yml` file
- `variableName`: the variable to retrieve (for example `'BUCKET_NAME'`)

## handelEnv
Retrieves environment variables injected into each service by Handel

Example result:
```
  {
    appName: 'TEST_APP',
    envName: 'DEV',
    serviceName: 'TESTARTIFACT',
    serviceVersion: 'V1',
    parameterStorePrefix: 'myapp.dev'
  }
```


# Parameter Store Values
Retrieve a set of values scoped under your Handel application from the AWS EC2 Parameter Store

## fetchParameters
Retrieves values from EC2 Parameter Store

Parameters: 
- `AWS`: An instance of the AWS node API. Be sure to set the region correctly.
- `keyList`: An array of keys to retrieve. Each one will be prefixed with the app name and
    environment name from Handel.

Example:
```
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-west-2'})

fetchParameters(AWS, ['mykey1', 'nested.key2']).then(data => {
  /*
    data will be equal to:
    {
      mykey1: 'MyValue1',
      nested: {
        key2: 'MyNestedValue2'
      }
    }
  */
})
```
