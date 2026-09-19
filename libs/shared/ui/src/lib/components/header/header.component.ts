import { Component, inject } from '@angular/core';
import { ThemeService } from '@sand-box/data-access';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-header',
  imports: [ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
