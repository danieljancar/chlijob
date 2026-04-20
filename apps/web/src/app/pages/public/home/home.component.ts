import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  CarouselComponent,
  CarouselItem,
} from '../../../shared/components/carousel/carousel.component';
import {
  ExpansionPanelComponent,
  ExpansionPanelItem,
} from '../../../shared/components/expansion-panel/expansion-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, TranslatePipe, CarouselComponent, ExpansionPanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected auth = inject(AuthService);

  protected carouselItems: CarouselItem[] = [
    {
      image: '/test1.jpg',
      titleKey: 'HOME.CAROUSEL1_TITLE',
      subtitleKey: 'HOME.CAROUSEL1_SUBTITLE',
    },
    {
      image: '/test2.jpg',
      titleKey: 'HOME.CAROUSEL2_TITLE',
      subtitleKey: 'HOME.CAROUSEL2_SUBTITLE',
    },
    {
      image: '/test3.jpg',
      titleKey: 'HOME.CAROUSEL3_TITLE',
      subtitleKey: 'HOME.CAROUSEL3_SUBTITLE',
    },
  ];

  protected faqItems: ExpansionPanelItem[] = [
    { title: 'HOME.FAQ1_TITLE', description: 'HOME.FAQ1_DESC' },
    { title: 'HOME.FAQ2_TITLE', description: 'HOME.FAQ2_DESC' },
    { title: 'HOME.FAQ3_TITLE', description: 'HOME.FAQ3_DESC' },
    { title: 'HOME.FAQ4_TITLE', description: 'HOME.FAQ4_DESC' },
    { title: 'HOME.FAQ5_TITLE', description: 'HOME.FAQ5_DESC' },
    { title: 'HOME.FAQ6_TITLE', description: 'HOME.FAQ6_DESC' },
  ];
}
