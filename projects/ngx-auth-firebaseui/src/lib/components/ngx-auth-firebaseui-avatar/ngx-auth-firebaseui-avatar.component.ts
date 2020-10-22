import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UserComponent} from '..';

export interface LinkMenuItem {
  text: string;
  icon?: string;
  // tslint:disable-next-line:ban-types
  callback?: Function;
}

@Component({
  selector: 'ngx-auth-firebaseui-avatar',
  templateUrl: './ngx-auth-firebaseui-avatar.component.html',
  styleUrls: ['./ngx-auth-firebaseui-avatar.component.scss']
})
export class NgxAuthFirebaseuiAvatarComponent implements OnInit {

  @Input()
  layout: 'default' | 'simple' = 'default';

  @Input()
  canLogout = true;

  @Input()
  links: LinkMenuItem[];

  @Input()
  canViewAccount = true;

  @Input()
  canDeleteAccount = true;

  @Input()
  canEditAccount = true;

  @Input()
  textProfile = 'Profile';

  @Input()
  textSignOut = 'Sign Out';

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onSignOut: EventEmitter<void> = new EventEmitter();

  user: User;
  user$: Observable<User | null>;
  displayNameInitials: string | null;

  constructor(public afa: AngularFireAuth,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.user$ = this.afa.user;
    this.user$.subscribe((user: User) => {
      this.user = user;
      this.displayNameInitials = user ? this.getDisplayNameInitials(user.displayName) : null;
    });
  }

  getDisplayNameInitials(displayName: string | null): string | null {
    if (!displayName) {
      return null;
    }
    const initialsRegExp: RegExpMatchArray = displayName.match(/\b\w/g) || [];
    const initials = ((initialsRegExp.shift() || '') + (initialsRegExp.pop() || '')).toUpperCase();
    return initials;
  }

  openProfile() {
    const dialogRef = this.dialog.open(UserComponent);
    const instance = dialogRef.componentInstance;
    instance.canDeleteAccount = this.canDeleteAccount;
    instance.canEditAccount = this.canEditAccount;
  }

  async signOut() {
    try {
      await this.afa.signOut();
      // Sign-out successful.
      this.onSignOut.emit();
    } catch (e) {
      // An error happened.
      console.error('An error happened while signing out!', e);
    }
  }
}
