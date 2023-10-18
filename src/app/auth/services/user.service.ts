import { Injectable, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, collectionData, } from '@angular/fire/firestore';

import { Observable, BehaviorSubject, from, map, takeUntil, Subject } from 'rxjs';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  private authenticatedUserSubject$ = new BehaviorSubject<UserData | null>(null);
  private authenticatedUserProfileSubject$ = new BehaviorSubject<UserData | null>(null);
  private unsubscribe$ = new Subject<void>();

  constructor(private auth: Auth,
    private firestore: Firestore) {
      this.getUserLogged()
  }



  setAuthenticatedUserSubject(user: UserData | null): void {
    this.authenticatedUserProfileSubject$.next(user)
  };


  getAuthenticatedUserSubject(): Observable<UserData | null> {
    return this.authenticatedUserProfileSubject$.asObservable();
  }


  setAuthenticatedUserProfileSubject(photo:any): void {
    this.authenticatedUserSubject$.next(photo)
  };


  getAuthenticatedUserProfileSubject(): Observable<UserData | null> {
    return this.authenticatedUserSubject$.asObservable();
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
      this.getUserById(user?.uid)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(user => {
        const userData = user[0]
        this.setAuthenticatedUserSubject(userData)
      })
    });
  }


  isUserLogged(): Observable<User | null> {
    return this.user$;
  }


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



  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
