import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public email;
  public name;
  public password;
  public confirmPassword;
  public registerError = false;
  public passwordError = false;
  public emptyFormError = false;

  constructor(private httpClient: HttpClient, private route: Router) { }

  ngOnInit() {
  }

  register() {
    if(this.name==undefined || this.email == undefined || this.password == undefined || this.confirmPassword == undefined){
      this.emptyFormError = true;
    }
    else{
      this.httpClient.get<any[]>('http://localhost:3000/users').subscribe((res) => {
      var users = res;
      var exists = false;
      if (this.password != this.confirmPassword) {
        this.passwordError = true;
      }
      else {
        this.passwordError = false;
        users.forEach(element => {
          if (element.email == this.email) {
            //User already exists
            this.registerError = true;
            exists = true;
          }
        });
        if (!exists) {
          //user not found. Add it to the user table in DB
          var newUser = {}
          newUser["name"] = this.name;
          newUser["username"] = this.email;
          newUser["email"] = this.email;
          newUser["password"] = this.password;
          newUser["image"] = "https://placeimg.com/500/300/tech";
          newUser["cart"] = [];
          this.httpClient.post("http://localhost:3000/users", newUser).subscribe((res) => {
            this.route.navigate(['/login']);
          });
        }
      }

    });
    }
  }

}
