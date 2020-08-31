import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";

import { User } from "./user.model";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
};

@Injectable({providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) {}

    // BehaviorSubject is same as Subject of rxjs/operators with additional features. 
    // It gives the access of previous emmites.
    // In short here it will provide use the user data which we have saved while login api call.
    user = new BehaviorSubject<User>(null);

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD0tll1mpzfEafIQYQfL5ZoDWRrZSC0IeQ', 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError), 
            tap(
                resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            )
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD0tll1mpzfEafIQYQfL5ZoDWRrZSC0IeQ',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(
                resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            )
        );
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn *1000);
        const userData = new User(email, userId, token, expirationDate);
        this.user.next(userData);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        console.log(errorResponse);
        let errorMessage = 'Unknown error occured!!'
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exist already!!!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
            default:
                break;
        }
        return throwError(errorMessage);
    }
}