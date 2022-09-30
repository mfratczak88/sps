import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'sps-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.renderAuthUi('auth-container');
  }
}
