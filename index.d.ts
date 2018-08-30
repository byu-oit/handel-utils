declare module 'handel-utils' {
    export const serviceList: {
        dynamodb: { vars: [ 'TABLE_NAME', 'TABLE_ARN' ] };
        efs: { vars: [ 'MOUNT_DIR' ] };
        memcached: { vars: [ 'ADDRESS', 'PORT' ] };
        mysql: { vars: [ 'ADDRESS', 'PORT', 'USERNAME', 'DATABASE_NAME' ] };
        postgresql: { vars: [ 'ADDRESS', 'PORT', 'USERNAME', 'DATABASE_NAME' ] };
        redis: { vars: [ 'ADDRESS', 'PORT' ] };
        s3: { vars: [ 'BUCKET_NAME', 'BUCKET_URL', 'REGION_ENDPOINT' ] };
        sns: { vars: [ 'TOPIC_ARN', 'TOPIC_NAME' ] };
        sqs: { vars: [ 'QUEUE_NAME', 'QUEUE_URL', 'QUEUE_ARN' ] };
    };

    interface HandelEnvironment {
        appName: string;
        envName: string;
        serviceName: string;
        serviceVersion: string;
        parameterStorePrefix: string;
    }

    export function getVariable(s: string, i: string, v: string): string;
    export function handelEnv(): HandelEnvironment;
    export function fetchParameters(AWS: any, keyList: string[]): any
}
