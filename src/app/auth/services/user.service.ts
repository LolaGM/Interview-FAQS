
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, authState, User, user } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor(private auth: Auth,
            private firestore: Firestore,
    ) { }


  register(email:any, password:any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }


  login(email:any,password:any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider);
  }


  logout() {
    return signOut(this.auth);
  }


  addUser(user:any){
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, user);
  }


   isUserLogged():Auth{
     return this.auth
   }




}
