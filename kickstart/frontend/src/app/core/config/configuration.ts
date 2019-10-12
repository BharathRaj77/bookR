export interface IConfiguration {
    tenant: string;
    clientId: string;
    endpoints: {
        graph: {
            url: string,
            resourceId: string
        },
        api: {
            url: string,
            resourceId: string
        }
    };
    cacheLocation: string;
    apiUrl: string;
    instrumentationKey: string;
}
