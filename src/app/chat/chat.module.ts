import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../shared/shared.module';
//import { RemoveSpecialCharPipe } from '../shared/pipe/remove-special-char.pipe';
import { ToastrModule } from 'ngx-toastr';
import { ChatRouteGuardService } from './chat-route-guard.service';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'chat', component: ChatBoxComponent, canActivate:[ChatRouteGuardService]},
    ]),
    SharedModule
  ],
  declarations: [ChatBoxComponent]  //RemoveSpecialCharPipe
})
export class ChatModule { }
