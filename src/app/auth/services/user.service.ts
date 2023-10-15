import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, } from '@angular/fire/firestore';

import { Observable, BehaviorSubject, from, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth,
    private firestore: Firestore) {

    this.getUserLogged()

  }



  register(email: any, password: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: any, password: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider);
  }

  logout() {
    return signOut(this.auth);
  }

  addUser(user: any) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, user);
  }

  getUserLogged() {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
      console.log("este es mi user desde servicio",user)
    });
  }

  // isUserLogged(): Observable<User | null> {
  //   return this.user$;
  // }




  getUserById(id:any){
    const usersRef = collection(this.firestore, 'users');
  return from(getDocs(usersRef)).pipe(
    map(snapshot => snapshot.docs.map(doc => doc.data())),
    map((users:any) => {
      if(id) {
         return users.filter((user:any)=>user.id === id)
      }
    })
  );
  }



  
}




