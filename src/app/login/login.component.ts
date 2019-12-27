import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email;
  public password;
  public loginError = false;
  constructor(private route: Router, private auth: AuthService, private myHTTPService: HttpService) { }

  ngOnInit() {
  }

  login() {
    this.myHTTPService.getUsers().subscribe((res) => {
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
