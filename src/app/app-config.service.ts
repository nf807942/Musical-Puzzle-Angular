import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfig } from './models/app-config';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AppConfigService {
    public static settings: IAppConfig;
    constructor(private http: HttpClient) {}

    load() {
        const jsonFile = `assets/config/config.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response : IAppConfig) => {
              AppConfigService.settings = <IAppConfig>response;
              resolve();
            }).catch((response: any) => {
              reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}