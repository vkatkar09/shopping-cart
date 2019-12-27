import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  products;
  totalCartCost = 0;
  currentUser = localStorage.getItem("LoggedInUser")
  currentUserID;
  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.getUserCartElements();

  }

  getUserCartElements() {
    this.httpClient.get<any[]>('http://localhost:3000/users').subscribe((res) => {
      var users = res;
      users.forEach(element => {
        if (element.email == this.currentUser) {
          this.currentUserID = element.id;
          this.products = element["cart"]
        }
      });
      var tempTotal = 0
      this.products.forEach(element => {
        tempTotal+= parseInt(element.cost)*parseInt(element.quantity);
      });
      this.totalCartCost = tempTotal;
    });
  }
  calculateIndividualTotal(cost, quantity) {
    return cost * quantity;
  }

  updateTotalProductCost(value, productId) {
    this.httpClient.get('http://localhost:3000/users/' + parseInt(this.currentUserID)).subscribe((res) => {
      var temp = res;
      var tempCart = res["cart"];
      tempCart.forEach(element => {
        if (element.id == parseInt(productId)) {
          element.quantity = parseInt(value)
        }
      });
      temp["cart"] = tempCart
      var tempTotal = 0
      // tempCart.forEach(element => {
      //   tempTotal += parseInt(element.quantity) * parseInt(element.cost)
      // });
      // this.totalCartCost = tempTotal;
      this.httpClient.put("http://localhost:3000/users/" + parseInt(this.currentUserID), temp).subscribe((res) => { 
        this.getUserCartElements();
      });
    });
  }

  updateCartTotal(content) {
    this.httpClient.get('http://localhost:3000/users/' + parseInt(this.currentUserID)).subscribe((res) => {
      this.getUserCartElements();
      var temp = res;
      var tempTotal = 0;
      var tempCart = res["cart"];
      tempCart.forEach(element => {
        tempTotal += parseInt(element.quantity) * parseInt(element.cost)
      });
      this.totalCartCost = tempTotal;
    })
  }

  logout() {
    this.auth.logout()
  }

  removeFromCart(product) {
    this.httpClient.get('http://localhost:3000/users/' + parseInt(this.currentUserID)).subscribe((res) => {
      var user = res;
      var userCart = res["cart"];
      var updatedUserCart = userCart.filter(function (item) {
        return item.id !== product.id;
      });
      userCart = updatedUserCart
      user["cart"] = userCart
      this.httpClient.put("http://localhost:3000/users/" + parseInt(this.currentUserID), user).subscribe((res) => { 
        this.getUserCartElements();
      });
    });
  }

  updateSearchModel(value) {
    console.log(value)
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }
}
