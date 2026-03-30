import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { Carousel } from '../../../shared/components/carousel/carousel';
import { ExpansionPanel } from '../../../shared/components/expansion-panel/expansion-panel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, TranslatePipe, Carousel, ExpansionPanel],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected auth = inject(AuthService);

  carouselItems = [
    { title: 'Das ist ein Baum', subtitle: 'Dieser Baum ist sehr schön', image: '/test1.jpg' }, 
    { title: 'Das ist eine Erdbeere', subtitle: 'Diese Erdbeere ist sehr süss. (und sie wird beobachtet?!)', image: '/test3.jpg' }, 
    { title: 'Dieser Mann hat vorher seine Frau ermordet', subtitle: 'Er sagt, es hätte sich noch nie so wohl gefühlt und würde es gerne wiederholen :D', image: '/test2.jpg' }
  ]

  faqItems = [
    { title: 'Wie funktioniert das?', subtitle: 'Grundlagen', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { title: 'Ist das sicher?', subtitle: 'Sicherheit', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { title: 'Wie kann ich mich anmelden?', subtitle: 'Anmeldung', description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
    { title: 'Gibt es eine mobile App?', subtitle: 'Mobile App', description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { title: 'Wie kontaktiere ich den Support?', subtitle: 'Support', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { title: 'Kann ich mein Konto löschen?', subtitle: 'Konto löschen', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  ]
}
