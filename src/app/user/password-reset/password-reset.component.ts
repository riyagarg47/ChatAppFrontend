import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

public email: any;
public password: any;
public confirmPassword: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService, public _route: ActivatedRoute) { }

  ngOnInit() {
  }

  public userId: string = this._route.snapshot.paramMap.get('userId');
  public resetPasswordFunction: any = () => {
  
    if(!this.password){
      this.toastr.warning('Please enter new password')
    }else{
      if(this.password != this.confirmPassword){
        this.toastr.warning('Password and Confirm password does not match')
      } else{
      let data = {
        userId: this.userId,
        password: this.password.toLowerCase(),
      }
      console.log(data)
      this.appService.resetPassword(data).subscribe((apiResponse) => {
        console.log(data.password);
        console.log(data.userId);
  
        if(apiResponse.status === 200){
          this.toastr.success(`Password reset successful.`)
          this.router.navigate(['/login'])
        }else {
          this.toastr.error(apiResponse.message)
        }
      }, (err) => {
        this.toastr.error('Some error occured')
      });
    }//end else condition
    }
  }//end reset password function

}
