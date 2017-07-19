# handel-utils
Utility library for apps deployed using [handel](https://github.com/byu-oit/handel) and
[handel-codepipeline](https://github.com/byu-oit/handel-codepipeline)

# Environment Variables

## getVariable
Retrieves the value of an environment variable injected by Handel

Parameters:
- `serviceType`: the type of the service exporting the variable (for example `'s3'`)
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
    serviceVersion: 'V1'
  }
```


## partialPrefix
Builds the part of the Environment Variable Prefix which is derived from the application name and
environment name.
([see Handel documentation](http://handel.readthedocs.io/en/latest/handel-basics/consuming-service-dependencies.html#environment-variable-prefix))

## servicePartialPrefix
Validates that the provided service type is recognized by Handel and injects variables, then returns
a partial prefix.

Parameters:
- `serviceType`

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
