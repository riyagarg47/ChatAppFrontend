import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

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
export class SocketService {

  private url = 'http://localhost:3000'
  private socket;

  constructor(public http: HttpClient) { 
    //connection is being created
    this.socket = io(this.url)
  }

  //events to be listened
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data)
      })//end socket
    })//end observable
  }//end verifyUser

 public onlineUserList = () => {
   return Observable.create((observer) => {
     this.socket.on('online-user-list', (userList) => {
       observer.next(userList)
     })//end socket
   })//end observable
 }//end setUserOnline

 public disconnectedSocket = () => {
   return Observable.create((observer) => {
     this.socket.on('disconnect', () => {
       observer.next();
     })//end socket
   })//end observable
 }//end disconnectedSocket

 public getChat(senderId, receiverId, skip): Observable<any> {
   return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
   .do(data => console.log('Data received'))
   .catch(this.handleError)
 }

 public chatByUserId = (userId) => {
   return Observable.create((observer) => {
     this.socket.on(userId, (data) => {
       observer.next(data);
     }) //end socket
   })//end observable
 } //end chatByUserId

//end events to be listened

//events to be emitted

public setUser = (authToken) => {
  this.socket.emit('set-user', authToken);
}//end setuser

public sendChatMessage = (chatMsgObject) => {
  this.socket.emit('chat-msg',chatMsgObject)
}//end send chat message

public exitSocket = () => {
  this.socket.disconnect();
} //end exit socket 

public markChatAsSeen = (userDetails) =>{
  this.socket.emit('mark-chat-as-seen', userDetails)
}// end mark chat as seen
//end events to be emitted

private handleError(err: HttpErrorResponse) {
 let  errorMessage = ''
 if(err.error instanceof Error){
   errorMessage = `An error occurred: ${err.error.message}`;
 }else{
   errorMessage = `Server returned code: ${err.status}, error message is ${err.message}`
 }
 console.log(errorMessage);
 return Observable.throw(errorMessage)
}// end handleError

//FUNCTION FOR ROOMS ONLY STARTS HERE

public getChatOfRoom(roomId, skip): Observable<any> {
  return this.http.get(`${this.url}/api/v1/chat/for/group?roomId=${roomId}&skip=${skip}`)
  .do(data => console.log('Data received'))
  .catch(this.handleError)
}

public chatByRoomId = (roomId) => {
  return Observable.create((observer) => {
    this.socket.on(roomId, (data) => {
      observer.next(data);
    }) //end socket
  })//end observable
} //end chatByUserId


public sendChatMessageToGroup = (chatMsgObjectForGroup) => {
  this.socket.emit('room-chat-msg',chatMsgObjectForGroup)
}//end send chat message

}
