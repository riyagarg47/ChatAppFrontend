import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.css']
})
export class EmailInputComponent implements OnInit {

  public email: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }
  public emailVerificationFunction: any = () => {
  
    if(!this.email){
      this.toastr.warning('Please enter your registered email.')
    }else{
      
      let data = {
        email: this.email,
      }
      console.log(data)
      this.appService.emailVerification(data).subscribe((apiResponse) => {
        console.log(data.email)
  
        if(apiResponse.status === 200){
          this.toastr.success(`Password Reset link sent to ${data.email}`)
          this.router.navigate(['/login'])
        }else {
          this.toastr.error(apiResponse.message)
        }
      }, (err) => {
        this.toastr.error('Some error occured')
      });
    }//end else condition
  }//end email verification function

}
