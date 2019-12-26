import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get<any[]>('http://localhost:3000/users').subscribe((res) => {
      var users = res;
      users.forEach(element => {
        if (element.email == this.currentUser) {
          this.currentUserID = element.id;
          this.products = element["cart"]
        }
      });
    });

    this.httpClient.get('http://localhost:3000/products').subscribe((res)=>{
      this.products =  res
  });
  }

  updateCart(product){
    this.httpClient.get('http://localhost:3000/users/'+ parseInt(this.currentUserID)).subscribe((res) => {
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
      this.httpClient.put("http://localhost:3000/users/"+ parseInt(this.currentUserID), user ).subscribe((res) => {});
    });
  }
}
