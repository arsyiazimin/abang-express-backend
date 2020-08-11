import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as config from 'config';

const API_KEY = config.get('API_KEY')

@Injectable()
export class OpenApiGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return true;
        // const request = context.switchToHttp().getRequest();
        // if (API_KEY === request.headers['x-api-key']) {
        //     return true
        // }
        // return false
    }
}