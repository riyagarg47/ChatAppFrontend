import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router'
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { GroupModule } from './group/group.module';
// import { RemoveSpecialCharPipe } from './shared/pipe/remove-special-char.pipe';
// import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent  
    // RemoveSpecialCharPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // SharedModule,
    ChatModule,
    UserModule,
    GroupModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full'},
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '*', component: LoginComponent },
      { path: '**', component: LoginComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
