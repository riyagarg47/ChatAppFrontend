import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { SocketService } from './../../socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public appService: AppService, 
    public router: Router, 
    public socketService: SocketService, 
    private toastr: ToastrService) { }

  ngOnInit() {
  }

public goToIndividualChatFunction:any = () => {
  this.router.navigate(['/chat']);
  this.toastr.info("Happy Gossiping :)")
}

public goToGroupChatFunction:any = () => {
  this.router.navigate(['/group-chat']);
  this.toastr.info("Have a great buddies time :)")
}

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

}
