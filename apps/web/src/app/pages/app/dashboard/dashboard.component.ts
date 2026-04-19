import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { CtaBanner } from '../../../shared/components/cta-banner/cta-banner';
import { CommonModule } from '@angular/common';

interface DashboardData {
  name: string;
  applications: number;
  jobs: number;
  earnings: number;
  rating: number;
}

interface InfoCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}

type Persona = 'nehmer' | 'geber';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CtaBanner, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  currentPersona: Persona = 'nehmer';

  private nehmerData: DashboardData = {
    name: 'Nehmer-Max',
    applications: 2,
    jobs: 2,
    earnings: 120,
    rating: 4.1,
  };

  private geberData: DashboardData = {
    name: 'Geber-Max',
    applications: 3,
    jobs: 3,
    earnings: 300,
    rating: 4.2,
  };

  data: DashboardData = this.nehmerData;

  setPersona(persona: Persona) {
    this.currentPersona = persona;

    this.data = persona === 'nehmer' ? this.nehmerData : this.geberData;
  }

  get cards(): InfoCard[] {
    return [
      {
        title: 'Aktive Jobs',
        value: this.data.jobs,
        subtitle: 'Bestätigt',
        icon: 'test',
      },
      {
        title: 'Bewerbungen',
        value: this.data.applications,
        subtitle: 'Ausstehend',
        icon: 'test',
      },
      {
        title: 'Verdient',
        value: `CHF ${this.data.earnings}`,
        subtitle: 'Monat',
        icon: 'test',
      },
      {
        title: 'Dein Rating',
        value: this.data.rating,
        subtitle: `aus ${this.data.rating} Bewertungen`,
        icon: 'test',
      },
    ];
  }
}
