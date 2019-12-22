import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopping-cart';
  products;
  totalCartCost=0;
  constructor(private httpClient: HttpClient) { }
  ngOnInit() {
    this.httpClient.get('http://localhost:3000/users/1').subscribe((res) => {
      this.products = res["cart"]
    });
  }

  calculateIndividualTotal(cost, quantity) {
    return cost * quantity;
  }

  updateTotalProductCost(value, productId) {
    this.httpClient.get('http://localhost:3000/users/1').subscribe((res) => {
      var temp = res;
      var tempCart = res["cart"];
      tempCart.forEach(element => {
        if (element.id == parseInt(productId)) {
          element.quantity = parseInt(value)
        }
      });
      temp["cart"] = tempCart
      var tempTotal=0
      tempCart.forEach(element => {
        tempTotal+= parseInt(element.quantity)*parseInt(element.cost)
       });
       this.totalCartCost = tempTotal;
      this.httpClient.put("http://localhost:3000/users/1", temp ).subscribe((res) => {});
    });
  }

  updateCartTotal(){
    this.httpClient.get('http://localhost:3000/users/1').subscribe((res) => {
      var temp = res;
      var tempTotal=0;
      var tempCart = res["cart"];
      tempCart.forEach(element => {
       tempTotal+= parseInt(element.quantity)*parseInt(element.cost)
      });
      this.totalCartCost = tempTotal;
    })
  }
}
