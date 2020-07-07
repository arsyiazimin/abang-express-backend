import { HttpException, HttpStatus } from "@nestjs/common";
import * as cls from 'cls-hooked';
import { IncomingMessage } from "http";

export class RequestContext {
    public static nsid = 'some_random_guid';
    public readonly id: string;
    public request: IncomingMessage;
    public response: Response;

    constructor(request: IncomingMessage, response: Response) {
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.request = request;
        this.response = response;
    }

    public static currentRequestContext(): RequestContext {
        const session = cls.getNamespace(RequestContext.nsid);
        if (session && session.active) {
            return session.get(RequestContext.name);
        }

        return null;
    }

    public static currentRequest(): IncomingMessage {
        let requestContext = RequestContext.currentRequestContext();

        if (requestContext) {
            return requestContext.request;
        }

        return null;
    }

    public static currentUser(throwError?: boolean): any {
        let requestContext = RequestContext.currentRequestContext();
        // console.log(requestContext);
        if (requestContext) {
            const user: any = requestContext.request['user'];
            if (user) {
                return user.user;
            }
        }

        if (throwError) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        return null;
    }
    
    public static currentBody(throwError?: boolean): any {
        let requestContext = RequestContext.currentRequestContext();
        // console.log(requestContext.request['body']);
        if (requestContext) {
            const body: any = requestContext.request['body'];
            // console.log(body[0]);
            if (body) {
                return body;
            }
        }

        if (throwError) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        return null;
    }

    public static getPrimaryId(): any {
        let requestContext = RequestContext.currentRequestContext();
        // console.log(requestContext);
        let id = requestContext.request['params'].id;

        if(id) {
            return id;
        }

        return null;
    }

    public static getTransId(): any {
        let requestContext = RequestContext.currentRequestContext();
        let id = requestContext.id;

        return id;
    }
}