export interface Environment {
    apiUrl: string;
    authority: string;
    clientId: string;
    storageName: string;
    production: boolean;
    oneSignal?: {
        appId: string;
        safari_web_id: string;
    };
    returnWebUrl?: string;
    hostname: string;
}
