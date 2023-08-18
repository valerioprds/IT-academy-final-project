import { Injectable } from '@angular/core';
import { FirebaseCodeErrorEnum } from '../utils/firebase-code-error';

@Injectable({
  providedIn: 'root',
})
export class FirebaseCodeErrorService {
  constructor() {}

  codeError(code: string) {
    switch (code) {
      case FirebaseCodeErrorEnum.emailAlreadyInUse:
        return 'user already exists';
      case FirebaseCodeErrorEnum.WeakPassword:
        return 'Password is too weak';
      case FirebaseCodeErrorEnum.InvalidEmail:
        return 'Email is not valid';
      case FirebaseCodeErrorEnum.WrongPassword:
        return 'Incorrect password';
      case FirebaseCodeErrorEnum.UserNotFound:
        return 'User does not exist';
      default:
        return 'unknown error';
    }
  }
}
