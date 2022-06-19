import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import { ChatService } from './chat.service';
import { Msg } from './msg';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('msgsView') msgsView: ElementRef;
  @ViewChild('msgSend') mgsSend: ElementRef;
  private sub$ = new Subscription();
  user: User;
  msgs;
  partner: boolean; 
  // inputData = new FormControl('');

  constructor(
    private chatService: ChatService, 
    private authService: AuthService,
    private af: AngularFirestore
     ) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.af.collection<Msg>('msgs').valueChanges().subscribe(
      (sub: Msg[]) => {
        this.msgs = sub
        this.msgs.forEach(c => {
          c.timeSend = this.convertDate(c.timeSend);
        });
        this.msgs = this.msgs.sort((a, b) => a.timeSend - b.timeSend);
        setTimeout(() => {
          this.onScrollDown();
          this.mgsSend.nativeElement.focus();
        }, 0);
      }
    )
  }

  ngOnDestroy() {
    this.chatService.onChangeStatus(this.user.userId);
    this.sub$.unsubscribe();
  }

  convertDate(date: any): Date {
    return new Date(date.seconds * 1000 + date.nanoseconds/1000000);
  }

  onScrollDown() {
    this.msgsView.nativeElement.scrollTop = 
    this.msgsView.nativeElement.scrollHeight
  }

  onSubmit(form: NgForm) {
    this.af.collection('msgs').add({
      email: this.user.email,
      msg: form.value.msgSend,
      timeSend: new Date()
    });
    form.reset();
    this.mgsSend.nativeElement.focus();
  }

}
