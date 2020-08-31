import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(
                loginUserData => {
                    // This if condition will check if user login or ont. If not then return url as it is.
                    if (!loginUserData) {
                        return next.handle(req);
                    }
                    const modifiedUrlReq = req.clone( 
                        { params: new HttpParams().set('auth', loginUserData.token)}
                     );
                    return next.handle(modifiedUrlReq);
                }
            )
        );
    }
}