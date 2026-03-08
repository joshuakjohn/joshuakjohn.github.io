import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
  EventEmitter, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-brief',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brief.component.html',
  styleUrls: ['./brief.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriefComponent implements OnInit, OnDestroy {

  // ── Typewriter ─────────────────────────────────────────────────────────────
  readonly typedWords = ['Full Stack Dev', 'Java Engineer', 'Angular Expert'];
  displayedText = '';

  private wordIndex = 0;
  private deleting = false;
  private paused = false;
  private typingTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Static data ────────────────────────────────────────────────────────────
  readonly stats: Stat[] = [
    { value: '1.5+', label: 'Years Exp' },
    { value: '20+',  label: 'Technologies' },
    { value: '5+',   label: 'Certifications' },
    { value: '3',    label: 'Domains' },
  ];

  @Output() knowMoreClickEemitter = new EventEmitter<void>();

  knowMoreClicked(): void {
    this.knowMoreClickEemitter.emit();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.runTyper();
  }

  ngOnDestroy(): void {
    if (this.typingTimer) clearTimeout(this.typingTimer);
  }

  // ── Typewriter ─────────────────────────────────────────────────────────────
  private runTyper(): void {
    if (this.paused) {
      this.typingTimer = setTimeout(() => {
        this.paused = false;
        this.runTyper();
      }, 1600);
      return;
    }

    const current = this.typedWords[this.wordIndex];

    if (!this.deleting) {
      if (this.displayedText.length < current.length) {
        this.displayedText = current.slice(0, this.displayedText.length + 1);
        this.cdr.markForCheck();
        this.typingTimer = setTimeout(() => this.runTyper(), 80);
      } else {
        this.paused = true;
        this.deleting = true;
        this.runTyper();
      }
    } else {
      if (this.displayedText.length > 0) {
        this.displayedText = this.displayedText.slice(0, -1);
        this.cdr.markForCheck();
        this.typingTimer = setTimeout(() => this.runTyper(), 45);
      } else {
        this.deleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.typedWords.length;
        this.typingTimer = setTimeout(() => this.runTyper(), 80);
      }
    }
  }
}