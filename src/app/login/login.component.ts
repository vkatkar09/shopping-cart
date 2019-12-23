import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email;
  public password;
  public loginError = false;
  constructor(private httpClient: HttpClient, private route: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.httpClient.get<any[]>('http://localhost:3000/users').subscribe((res) => {
      var users = res;
      var found = false;
      users.forEach(element => {
        if (element.email == this.email) {
          if (element.password == this.password) //User exists
          {
            found = true;
            this.auth.sendToken(this.email)
            this.route.navigate(['/products'])
          }
        }
      });
      if (!found) {
        //user not found
        this.loginError = true;
      }
    });
  }

}
