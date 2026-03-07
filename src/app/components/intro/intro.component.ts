import 'hammerjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RIGHT_ARROW } from 'src/assets/svg-icons';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [
    trigger('combinedAnimation', [
      transition('void => fade', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition('fade => void', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ]),
      transition('void => slide', [
        style({ transform: 'translateX(-100vw)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('slide => void', [
        animate('500ms ease-in-out', style({ transform: 'translateX(-200vw)', opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-20px) rotate(180deg)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0) rotate(180deg)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-out', style({ transform: 'translateX(-20px) rotate(180deg)', opacity: 0 }))
      ])
    ]),
    trigger('slideRightInOut', [
      transition(':enter', [
        style({ transform: 'translateX(200vw)', opacity: 1 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateX(200vw)', opacity: 1 }))
      ])
    ]),
    trigger('slideDownInOut', [
      transition(':enter', [
        style({ transform: 'translateY(200vw)', opacity: 1 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateY(200vw)', opacity: 1 }))
      ])
    ]),
    trigger('slideLeftInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100vw)', opacity: 1 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateX(-200vw)', opacity: 1 }))
      ])
    ])
  ]
})
export class IntroComponent {
  isShifted = false;
  know_more = false;
  know_moreee = false;
  know_less = true;
  currentAnimation = 'fade';

  private touchStartX = 0;
  private touchStartY = 0;

  constructor(private sanitizer: DomSanitizer, private iconRegistry: MatIconRegistry) {
    iconRegistry.addSvgIconLiteral('right-arrow', sanitizer.bypassSecurityTrustHtml(RIGHT_ARROW));
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const deltaY = event.changedTouches[0].clientY - this.touchStartY;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    if (isHorizontalSwipe && deltaX > 50) {
      this.swipeRight();
    }
  }

  swipeLeft(): void {
    if (!this.isShifted) this.right_arrow_action();
  }

  swipeRight(): void {
    if (this.isShifted) this.right_arrow_action();
  }

  swipeDown(): void {
    if (this.know_more) this.know_more_click();
  }

  right_arrow_action(): void {
    this.setAnimation('slide');
    setTimeout(() => {
      if (!this.know_more) this.isShifted = !this.isShifted;
    });
  }

  know_more_click(): void {
    this.setAnimation('fade');
    setTimeout(() => {
      if (this.know_less) {
        this.know_less = false;
        setTimeout(() => {
          this.know_more = true;
          setTimeout(() => { this.know_moreee = true; }, 400);
        }, 400);
      } else {
        this.know_moreee = false;
        setTimeout(() => {
          this.know_more = false;
          setTimeout(() => { this.know_less = true; }, 400);
        }, 400);
      }
    });
  }

  private setAnimation(type: string): void {
    setTimeout(() => { this.currentAnimation = type; });
  }
}