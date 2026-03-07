import { Component } from '@angular/core';

export interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  dur: number;
  delay: number;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  particles: Particle[] = [];
  title = 'portfolio';

  ngOnInit(): void {
    document.body.style.overflow = 'hidden'; // Disable scrolling

    this.particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      dur: Math.random() * 6 + 4,
      delay: Math.random() * 4,
      color: ['#968ff9', '#b8a9ff', '#c4b8ff'][i % 3],
    }));
  }

  trackByParticle(_: number, p: Particle): number { return p.id; }

}
