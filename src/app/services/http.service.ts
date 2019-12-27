import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }
  private API_ENDPOINT = "http://localhost:3000/"
  getUsers(){
    return this.httpClient.get<any[]>(this.API_ENDPOINT + 'users')
  }
  
  getUser(userID){
    return this.httpClient.get<any[]>(this.API_ENDPOINT + 'users/'+ parseInt(userID))
  }

  updateUser(userID, user){
    return this.httpClient.put(this.API_ENDPOINT + 'users/'+ parseInt(userID), user);
  }

  addUser(user){
    return this.httpClient.post(this.API_ENDPOINT + 'users', user);
  }

  getProducts(){
    return this.httpClient.get<any[]>(this.API_ENDPOINT + 'products')
  }
}
