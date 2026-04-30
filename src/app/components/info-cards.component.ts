import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Company, Location } from '../models/interfaces';

@Component({
  selector: 'app-info-cards',
  template: `
    <section class="cards-section row g-4 mb-5">
      @for (card of cards(); track card.title) {
        <div class="card-wrapper col-12 col-md-4 d-flex flex-column align-items-center">
          <h2>{{ card.title }}</h2>
          <div class="card h-100 w-100 d-flex flex-column align-items-center text-center">
            <p class="card-text">{{ card.text }}</p>
            <img class="card-image" [src]="card.image" [alt]="card.title">
            @if (card.subtitle) {
              <span class="card-subtitle">{{ card.subtitle }}</span>
            }
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: '../../../Web/Style/Template_style/cards.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoCardsComponent {
  @Input({ required: true }) company!: Company;
  @Input() locations: Location[] = [];

  cards(): Array<{ title: string; text: string; image: string; subtitle: string }> {
    return [
      {
        title: 'Quiénes somos',
        text: this.company.about,
        image: this.company.aboutImage,
        subtitle: ''
      },
      {
        title: 'Historia',
        text: this.company.history,
        image: this.company.historyImage,
        subtitle: ''
      },
      {
        title: 'Dónde encontrarnos',
        text: this.company.address,
        image: this.company.locationImage,
        subtitle: this.locations.map((location) => location.name).join(', ')
      }
    ];
  }
}
