import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  private sub$ = new Subscription();
  isAuth: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.onAutoLogin();
    this.sub$.add(
      this.authService.authChange.subscribe(
        sub => {
          this.isAuth = sub;
        }
      )
    );
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  onLogout() {
    this.authService.onLogout();
  }

}
