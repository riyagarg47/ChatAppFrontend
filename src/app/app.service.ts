import { Injectable } from '@angular/core';
import { Observable } from 'rxjs//Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

 private url = 'http://localhost:3000';

  constructor(public http: HttpClient) { }

 public getUserInfoFromLocalStorage = () => {
   return JSON.parse(localStorage.getItem('userInfo'))
 }

 public setUserInfoInLocalStorage = (data) => {
  localStorage.setItem('userInfo', JSON.stringify(data))
}

public getRoomInfoFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('roomInfo'))
}

public setRoomInfoInLocalStorage = (data) => {
 localStorage.setItem('roomInfo', JSON.stringify(data))
}
  
  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobileNumber', data.mobileNumber)
    .set('email', data.email)
    .set('password', data.password);
  
return this.http.post(`${this.url}/api/v1/users/signup`, params);

}// end of signup function

 public signinFunction(data): Observable<any> {

  const params = new HttpParams()
  .set('email', data.email)
  .set('password', data.password);

return this.http.post(`${this.url}/api/v1/users/login`, params);

 }// end of signin function 
public emailVerification(data): Observable<any> {
  const params =  new HttpParams()
  .set('email', data.email);

  return this.http.get(`${this.url}/api/v1/users/${data.email}/forgotPassword`) 
}// end email verification for forgot password

 public resetPassword(data): Observable<any> {

  const params = new HttpParams()
  .set('userId', data.userId)
  .set('password', data.password);

  return this.http.post(`${this.url}/api/v1/users/resetPassword`, params) 
 }//end reset password

 public logout(): Observable<any> {

  const params = new HttpParams()
    .set('userId', Cookie.get('receiverId'))

  return this.http.post(`${this.url}/api/v1/users/:userId/logout`, params);

} // end logout function

private handleError(err: HttpErrorResponse) {

  let errorMessage = '';

  if (err.error instanceof Error) {

    errorMessage = `An error occurred: ${err.error.message}`;

  } else {

    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

  } // end condition *if

  console.error(errorMessage);

  return Observable.throw(errorMessage);

}  // END handleError


public createRoom(data): Observable<any> {
  const params = new HttpParams()
  .set('userEmail', data.userEmail)
  .set('roomName', data.roomName);

  return this.http.post(`${this.url}/api/v1/room/createChatRoom`, params);
  }//end create room function


  public getAllRooms(): Observable<any> {
    console.log('All rooms displayed');
    return this.http.get(`${this.url}/api/v1/room/view/all`)
 
  }//end get all rooms

}
