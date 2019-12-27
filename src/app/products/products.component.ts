import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @Input()
  searchModel: string;
  public products;
  currentUser = localStorage.getItem("LoggedInUser")
  currentUserID;

  constructor(private myHTTPService: HttpService) { }

  ngOnInit() {
    this.myHTTPService.getUsers().subscribe((res) => {
      var users = res;
      users.forEach(element => {
        if (element.email == this.currentUser) {
          this.currentUserID = element.id;
          this.products = element["cart"]
        }
      });
    });

    this.myHTTPService.getProducts().subscribe((res)=>{
      this.products =  res
  });
  }

  updateCart(product){
    this.myHTTPService.getUser(this.currentUserID).subscribe((res) => {
      var user = res;
      var keepGoing = true;
      var userCart = res["cart"];
      userCart.forEach(element => {
        if(keepGoing){
          if(element.id == product.id){
            element.quantity+=1;
            keepGoing = false;
          }
        }
      });
      if(keepGoing){
        userCart[userCart.length] = product
      }
      user["cart"] = userCart
      this.myHTTPService.updateUser(this.currentUserID, user).subscribe((res) => {});
    });
  }
}
