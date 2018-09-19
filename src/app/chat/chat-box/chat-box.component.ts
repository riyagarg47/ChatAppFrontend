import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../../app.service';
import { SocketService } from './../../socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { FirstCharComponent } from '../../shared/first-char/first-char.component';
//import { $ } from 'protractor';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit {

  @ViewChild('scrollMe', {read: ElementRef})
  public scrollMe: ElementRef;
  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public messageText: any;
  public messageList: any = [];
  public scrollToChatTop: boolean = false;
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;
  

  constructor(public appService: AppService, 
    public router: Router, 
    public socketService: SocketService, 
    private toastr: ToastrService) {
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
   }
   
   public openNav() {
    document.getElementById("mySidenav").style.width = "300px";
}

public closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

  ngOnInit() {
    this.authToken = Cookie.get('authtoken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();  
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromAUser();
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe((data) => {

      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
      this.getOnlineUserList();
    });
  }// end verifyUserConfirmation

  public getOnlineUserList: any = () => {
    this.socketService.onlineUserList().subscribe((userList) => {
      this.userList = [];
      for (let x in userList){
        let temp = {'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false}
        this.userList.push(temp);
      }
      console.log(this.userList)
    });
  }// end getOnlineUserList

  public sendMessageUsingKeypress: any = (event:any) => {
    if(event.keyCode === 13) { //13 is keyCode of enter
      this.sendMessage();
    }
  }//end sendMessageUsingKeypress

  public sendMessage: any =() => {
    if(this.messageText){
      let chatMsgObject ={
        senderId: this.userInfo.userId,
        senderName: this.userInfo.firstName +" "+ this.userInfo.lastName,
        receiverId: Cookie.get('receiverId'),
        receiverName: Cookie.get('receiverName'),
        message: this.messageText,
        createdOn: new Date()
      }// end chatMsgObject
      console.log(chatMsgObject);
      this.socketService.sendChatMessage(chatMsgObject);
      this.pushToChatWindow(chatMsgObject)
    } else{
      this.toastr.warning('Text message cannot be empty')
    }
  }//end sendMessage

  public pushToChatWindow: any = (data) => {
    this.messageText="";
    this.messageList.push(data);
    this.scrollToChatTop = false;
  }// end push to chat window

  public getMessageFromAUser: any = () => {
    this.socketService.chatByUserId(this.userInfo.userId).subscribe((data) => {
      (this.receiverId == data.senderId)?this.messageList.push(data):'';
      this.toastr.success(`${data.senderName} says: ${data.message}`)
      this.scrollToChatTop = false;
    })
  }//end getMessageFromAUser

  public userSelectedToChat: any = (id, name) => {
    console.log("setting user as active")
    this.userList.map((user)=>{
      if(user.userId == id){
        user.chatting = true;
      }else{
        user.chatting = false;
      }
    })

    Cookie.set('receiverId', id);
    Cookie.set('receiverName', name);
    this.receiverId = id;
    this.messageList = [];
    this.pageValue = 0;
    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }

    //this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithUser();
  }// end userSelectedToChat

  public getPreviousChatWithUser: any = () => {
    let previousData = (this.messageList.length>0?this.messageList.slice():[]);
    this.socketService.getChat(this.userInfo.userId, this.receiverId,this.pageValue * 10)
    .subscribe((apiResponse) => {
      console.log(apiResponse);
      if(apiResponse.status == 200){
        this.messageList = apiResponse.data.concat(previousData)
      }else{
        this.messageList = previousData;
        this.toastr.warning('No messages available')
      }

      this.loadingPreviousChat = false;
    },(err)=>{
      this.toastr.error('Some error occured.')
    })
  } // end get previous chat with a user

  public loadEarlierPageOfChat: any = () => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatWithUser();
  }// end load previous chat

  public logout: any = () => {
    this.appService.logout().subscribe((apiResponse) => {
      if(apiResponse.status == 200){
        console.log("logout called");
        Cookie.delete('authtoken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        this.socketService.exitSocket()
        this.router.navigate(['/']);
        this.toastr.success("You are logged out successfully.")
      }else{
        this.toastr.error(apiResponse.message)
      }
    }, (err) => {
      this.toastr.error('Some error occured.')
    });
  }//end logout

  public showUserName = (name:string)=>{  //to be used  
    this.toastr.success("You are chatting with "+name)
  }
}
