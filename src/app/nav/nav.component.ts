import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';

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

  constructor(private auth: AuthService, private myHTTPService: HttpService) { }

  ngOnInit() {
    this.getUserCartElements();

  }

  getUserCartElements() {
    this.myHTTPService.getUsers().subscribe((res) => {
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
    
    this.myHTTPService.getUser(this.currentUserID).subscribe((res) => {
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
      this.myHTTPService.updateUser(this.currentUserID, temp).subscribe((res) => { 
        this.getUserCartElements();
      });
    });
  }

  updateCartTotal(content) {
    this.myHTTPService.getUser(this.currentUserID).subscribe((res) => {
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
    this.myHTTPService.getUser(this.currentUserID).subscribe((res) => {
      var user = res;
      var userCart = res["cart"];
      var updatedUserCart = userCart.filter(function (item) {
        return item.id !== product.id;
      });
      userCart = updatedUserCart
      user["cart"] = userCart
      this.myHTTPService.updateUser(this.currentUserID, user).subscribe((res) => { 
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
