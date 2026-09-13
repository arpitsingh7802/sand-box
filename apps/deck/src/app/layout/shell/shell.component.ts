import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { APP_REGISTRY } from '@sand-box/shared-data';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl:'./shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  // apps = APP_REGISTRY;
}
