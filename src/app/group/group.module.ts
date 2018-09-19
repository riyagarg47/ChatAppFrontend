import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ChatRouteGuardService } from './../chat/chat-route-guard.service';
import { SharedModule } from '../shared/shared.module';
// import { RemoveSpecialCharPipe } from '../shared/pipe/remove-special-char.pipe';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'group-chat', component: GroupChatComponent, canActivate:[ChatRouteGuardService]},
    ]),
    SharedModule
  ],
  declarations: [GroupChatComponent]  //RemoveSpecialCharPipe
})
export class GroupModule { }
