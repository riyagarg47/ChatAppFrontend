import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppService } from './../../app.service';
import { SocketService } from './../../socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  providers: [SocketService]
})
export class GroupChatComponent implements OnInit {

  @ViewChild('scrollMe', {read: ElementRef})
  public scrollMe: ElementRef;
  public authToken: any;
  public userInfo: any;
  public roomInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public messageTextInGroup: any;
  public messageListOfGroup: any = [];
  public scrollToChatTop: boolean = false;
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;

  public roomId: any;
  public roomName: any;
  public userEmail: any;
  public roomDetails: any = [];
  public roomList: any = [];


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
    this.roomInfo = this.appService.getRoomInfoFromLocalStorage(); 
    this.userInfo = this.appService.getUserInfoFromLocalStorage();  
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getAllRoomsFunction();
    // this.getMessageFromAUser();
  }
 
  public verifyUserConfirmation: any = () => {  //checked
    this.socketService.verifyUser().subscribe((data) => {

      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
      this.getOnlineUserList();
    });
  }// end verifyUserConfirmation

  public getOnlineUserList: any = () => {
    this.socketService.onlineUserList().subscribe((userList) => {  //checked
      this.userList = [];
      for (let x in userList){
        let temp = {'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false}
        this.userList.push(temp);
      }
      console.log(this.userList)
    });
  }// end getOnlineUserList



  public getAllRoomsFunction: any = () => {
    this.appService.getAllRooms().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
           for(let x of apiResponse.data)
           {
               this.roomList.push(x.roomName);
           }
          console.log(this.roomList);
      }else{
        this.toastr.error(apiResponse.message)
      }
    }, (err) => {
      this.toastr.error("Some error occured")
    });
  } // end get all rooms function

  
  
  public roomSelectedToChat: any = (id, name) => {
    console.log("setting group as current chat group")
    this.roomList.map((room)=>{
      if(room.roomId == id){
        room.chatting = true;
      }else{
        room.chatting = false;
      }
    })

    Cookie.set('roomId', id);
    Cookie.set('roomName', name);
    this.roomId = id;
    this.messageListOfGroup = [];
    this.pageValue = 0;
    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }// end room selected to chat

    this.getPreviousChatOfRoom();
  }

public createRoomFunction: any = () => {
  if(!this.roomName){
    this.toastr.warning('Please enter Group Name');
  }else
  {
    let data = {
      userEmail: this.userInfo.email.toLowerCase(),
      roomName: this.roomName
    }
    console.log(data)
  this.appService.createRoom(data).subscribe((apiResponse) => {
    console.log(apiResponse);

    if(apiResponse.status === 200) {
      this.toastr.success('Group Created Successfully.');
      //  setTimeout(() => {
      // this.router.navigate(['group-chat'])
      //  }, 2000);
    } else {
      this.toastr.error(apiResponse.message);
    }
  }, (err) => {
    this.toastr.error('Some error occured');
  })
  }
}//end create room function




  // public getMessageFromAUser: any = () => {
  //   this.socketService.chatByRoomId(this.userInfo.userId).subscribe((data) => {
  //     (this.receiverId == data.senderId)?this.messageListOfGroup.push(data):'';
  //     this.toastr.success(`${data.senderName} says: ${data.message}`)
  //     this.scrollToChatTop = false;
  //   })
  // }//end getMessageFromAUser

  public getPreviousChatOfRoom: any = () => {  //checked
    let previousDataOfGroup = (this.messageListOfGroup.length>0?this.messageListOfGroup.slice():[]);
    this.socketService.getChatOfRoom(this.receiverId, this.pageValue * 10)
    .subscribe((apiResponse) => {
      console.log(apiResponse);
      if(apiResponse.status == 200){
        this.messageListOfGroup = apiResponse.data.concat(previousDataOfGroup)
      }else{
        this.messageListOfGroup = previousDataOfGroup;
        this.toastr.warning('No messages available')
      }

      this.loadingPreviousChat = false;
    },(err)=>{
      this.toastr.error('Some error occured.')
    })
  } // end get previous chat with a user


  public loadEarlierPageOfChat: any = () => { //checked
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatOfRoom();
  }// end load previous chat

  public sendMessageUsingKeypress: any = (event:any) => {  //checked
    if(event.keyCode === 13) { //13 is keyCode of enter
       this.sendMessageToGroup();
      console.log("Message sent from group.")
    }
  }//end sendMessageUsingKeypress


  public pushToChatWindowOfGroup: any = (data) => {  //checked
    this.messageTextInGroup="";
    this.messageListOfGroup.push(data);
    this.scrollToChatTop = false;
  }// end push to chat window

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

  public sendMessageToGroup: any =() => { //checked
    if(this.messageTextInGroup){
      let chatMsgObjectForGroup ={
        senderId: this.userInfo.userId,
        senderName: this.userInfo.firstName +" "+ this.userInfo.lastName,
        receiverId: Cookie.get('receiverId'),
        receiverName: Cookie.get('receiverName'),
        message: this.messageTextInGroup,
        chatRoom:this.roomInfo.roomId,
        createdOn: new Date()
      }// end chatMsgObjectForGroup
      console.log(chatMsgObjectForGroup);
      this.socketService.sendChatMessageToGroup(chatMsgObjectForGroup);
      this.pushToChatWindowOfGroup(chatMsgObjectForGroup)
    } else{
      this.toastr.warning('Text message cannot be empty')
    }
  }//end sendMessage to group

}
