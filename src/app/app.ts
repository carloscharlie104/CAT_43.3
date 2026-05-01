import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer.component';
import { HeaderComponent } from './shared/header.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  template: `
    <div class="page-shell min-vh-100 d-flex flex-column">
      <app-header />
      <div class="router-shell flex-grow-1 d-flex flex-column">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
