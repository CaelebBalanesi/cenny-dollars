import { Component, Inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from './User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private firebaseService: FirebaseService, public dialog: MatDialog) {
    this.users$ = firebaseService.getUsers()
  }

  users$: Observable<User[]>;
  username: string = "Unknown User";
  recipient!: string;
  money: number = 0;
  amount!: number;

  getMoney() {
    this.firebaseService.getMoneyByUsername(this.username)
      .subscribe(amount => this.money = amount);
  }

  sendMoney() {
    this.firebaseService.sendMoney(this.username, this.recipient, this.amount)
      .then(() => {
        console.log('Money sent successfully');
      })
      .catch(error => {
        console.error('Failed to send money:', error);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog);

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      console.log(result);
      this.username = result;
      this.getMoney();
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `
    <div class="container">
      Username: <input [(ngModel)]="username" placeholder="username">
      <div mat-dialog-actions>
        <button mat-button [mat-dialog-close]="username">submit</button>
        <button (click)="onNoClick()">close</button>
      </div>
    </div>
  `,
  styles: [
    ".container {height: 200px; width: 500px; top: 0px; left: 0px;}",
  ]
})
export class LoginDialog {
  constructor(public dialogRef: MatDialogRef<LoginDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  username!: string;

  onNoClick(): void {
    this.dialogRef.close();
  }
}