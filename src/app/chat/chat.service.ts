import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private af: AngularFirestore) { }

  onChangeStatus(userId: string) {
    // this.af.collection('users').doc(userId).update({status: false});
  }
}
