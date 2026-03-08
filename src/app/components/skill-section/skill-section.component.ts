import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChildren, QueryList, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Skill, SkillCategory, TagStyle, StatItem } from './skills.models';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import {
  ANGULAR, CSS, DOCKER, EXPRESS, GIT, HTML, JAVA, JAVASCRIPT,
  JENKINS, INTELLIJ, MAVEN, MONGODB, MS, NODE,
  POSTMAN, REDHAT, RESTAPI, SPRING, SQL, SWAGGER, TYPESCRIPT, VSCODE
} from 'src/assets/svg-icons';

@Component({
  selector: 'app-skill-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './skill-section.component.html',
  styleUrls: ['./skill-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioSkillsComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── State ──────────────────────────────────────────────────────────────────
  activeTab = 'all';
  activeSkill: string | null = null;
  hoveredSkill: string | null = null;
  countMap: Record<string, number> = {};

  @ViewChildren('categoryRef') categoryRefs!: QueryList<ElementRef>;
  visibleCategories: Set<string> = new Set();
  private observers: IntersectionObserver[] = [];

  // ── Data ───────────────────────────────────────────────────────────────────
  readonly skillCategories: SkillCategory[] = [
    {
      id: 'frontend',
      label: 'Frontend',
      color: '#968ff9',
      glow: 'rgba(150, 143, 249, 0.13)',
      glowSoft: 'rgba(150,143,249,0.08)',
      skills: [
        { name: 'Angular',      level: 82, years: '1.5+ yrs', tag: 'Advanced', desc: 'Built enterprise dashboards and reusable component libraries.' },
        { name: 'TypeScript',   level: 88, years: '1.5+ yrs', tag: 'Advanced', desc: 'Typed entire frontend codebases to eliminate runtime errors.' },
        { name: 'HTML5',        level: 95, years: '1.5+ yrs', tag: 'Expert',   desc: 'Structured accessible, SEO-friendly web application layouts.' },
        { name: 'CSS3 / SCSS',  level: 85, years: '1.5+ yrs', tag: 'Advanced', desc: 'Designed responsive UIs and maintainable SCSS design systems.' },
      ],
    },
    {
      id: 'backend',
      label: 'Backend',
      color: '#ae9eff',
      glow: 'rgba(184,169,255,0.4)',
      glowSoft: 'rgba(184,169,255,0.08)',
      skills: [
        { name: 'Java',         level: 93, years: '1.5+ yrs', tag: 'Advanced', desc: 'Developed scalable backend services and concurrent applications.' },
        { name: 'Spring Boot',  level: 80, years: '1+ yrs',   tag: 'Advanced', desc: 'Built secure, production-ready REST microservices.' },
        { name: 'Node.js',      level: 80, years: '1.5+ yrs', tag: 'Advanced', desc: 'Powered real-time features and high-throughput backend services.' },
        { name: 'SQL',          level: 75, years: '1+ yrs',   tag: 'Advanced', desc: 'Optimized queries and schemas for relational databases.' },
        { name: 'MongoDB',      level: 85, years: '1.5+ yrs', tag: 'Advanced', desc: 'Stored and queried flexible data for fast-iterating products.' },
        { name: 'Express',      level: 60, years: '1+ yrs',   tag: 'Advanced', desc: 'Scaffolded lightweight APIs and middleware-driven backends.' },
        { name: 'REST APIs',    level: 94, years: '1.5+ yrs', tag: 'Expert',   desc: 'Designed and integrated APIs across full-stack applications.' },
        { name: 'Microservices',level: 75, years: '1+ yrs',   tag: 'Advanced', desc: 'Decomposed monoliths into independently deployable services.' },
      ],
    },
    {
      id: 'devops',
      label: 'DevOps & Tools',
      color: '#c2b6ff',
      glow: 'rgba(196,184,255,0.4)',
      glowSoft: 'rgba(196,184,255,0.08)',
      skills: [
        { name: 'Git',          level: 90, years: '1.5+ yrs', tag: 'Expert',   desc: 'Managed codebases, branching workflows and team code reviews.' },
        { name: 'Docker',       level: 70, years: '1+ yrs',   tag: 'Advanced', desc: 'Containerized apps for consistent dev and production environments.' },
        { name: 'Jenkins',      level: 65, years: '1.5+ yrs', tag: 'Advanced', desc: 'Automated build, test and deployment pipelines for releases.' },
        { name: 'Maven',        level: 82, years: '1.5+ yrs', tag: 'Advanced', desc: 'Managed dependencies and build lifecycle for Java projects.' },
        { name: 'Redhat',       level: 70, years: '1+ yrs',   tag: 'Advanced', desc: 'Administered enterprise Linux servers and automated tasks.' },
        { name: 'Lightspeed',   level: 74, years: '1+ yrs',   tag: 'Advanced', desc: 'Automated infrastructure provisioning and config deployment.' },
        { name: 'Postman',      level: 90, years: '1.5+ yrs', tag: 'Advanced', desc: 'Tested and documented APIs throughout development lifecycle.' },
        { name: 'Swagger',      level: 80, years: '1.5+ yrs', tag: 'Advanced', desc: 'Published interactive API docs consumed by frontend teams.' },
        { name: 'VS Code',      level: 90, years: '1.5+ yrs', tag: 'Advanced', desc: 'Primary editor for all frontend and Node.js development.' },
        { name: 'Intellij Idea',level: 90, years: '1.5+ yrs', tag: 'Advanced', desc: 'Primary IDE for Java and Spring Boot development.' },
      ],
    },
  ];

  readonly tagColors: Record<string, TagStyle> = {
    Expert:   { bg: 'rgba(150,143,249,0.18)', border: 'rgba(150,143,249,0.55)', text: '#c8c2ff' },
    Advanced: { bg: 'rgba(196,184,255,0.12)', border: 'rgba(196,184,255,0.4)',  text: '#e2d9ff' },
  };

  tabs: { id: string; label: string; color?: string }[] = [];
  visibleCategoryList: SkillCategory[] = [];
  stats: StatItem[] = [];

  readonly categoryIcons: Record<string, SafeHtml> = {};

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {
    iconRegistry.addSvgIconLiteral('Docker',       sanitizer.bypassSecurityTrustHtml(DOCKER));
    iconRegistry.addSvgIconLiteral('Git',          sanitizer.bypassSecurityTrustHtml(GIT));
    iconRegistry.addSvgIconLiteral('Microservices',sanitizer.bypassSecurityTrustHtml(MS));
    iconRegistry.addSvgIconLiteral('Spring Boot',  sanitizer.bypassSecurityTrustHtml(SPRING));
    iconRegistry.addSvgIconLiteral('REST APIs',    sanitizer.bypassSecurityTrustHtml(RESTAPI));
    iconRegistry.addSvgIconLiteral('SQL',          sanitizer.bypassSecurityTrustHtml(SQL));
    iconRegistry.addSvgIconLiteral('CSS3 / SCSS',  sanitizer.bypassSecurityTrustHtml(CSS));
    iconRegistry.addSvgIconLiteral('HTML5',        sanitizer.bypassSecurityTrustHtml(HTML));
    iconRegistry.addSvgIconLiteral('Java',         sanitizer.bypassSecurityTrustHtml(JAVA));
    iconRegistry.addSvgIconLiteral('Javascript',   sanitizer.bypassSecurityTrustHtml(JAVASCRIPT));
    iconRegistry.addSvgIconLiteral('TypeScript',   sanitizer.bypassSecurityTrustHtml(TYPESCRIPT));
    iconRegistry.addSvgIconLiteral('Angular',      sanitizer.bypassSecurityTrustHtml(ANGULAR));
    iconRegistry.addSvgIconLiteral('MongoDB',      sanitizer.bypassSecurityTrustHtml(MONGODB));
    iconRegistry.addSvgIconLiteral('Express',      sanitizer.bypassSecurityTrustHtml(EXPRESS));
    iconRegistry.addSvgIconLiteral('Node.js',      sanitizer.bypassSecurityTrustHtml(NODE));
    iconRegistry.addSvgIconLiteral('Jenkins',      sanitizer.bypassSecurityTrustHtml(JENKINS));
    iconRegistry.addSvgIconLiteral('Postman',      sanitizer.bypassSecurityTrustHtml(POSTMAN));
    iconRegistry.addSvgIconLiteral('Swagger',      sanitizer.bypassSecurityTrustHtml(SWAGGER));
    iconRegistry.addSvgIconLiteral('Redhat',       sanitizer.bypassSecurityTrustHtml(REDHAT));
    iconRegistry.addSvgIconLiteral('VS Code',      sanitizer.bypassSecurityTrustHtml(VSCODE));
    iconRegistry.addSvgIconLiteral('Intellij Idea',sanitizer.bypassSecurityTrustHtml(INTELLIJ));
    iconRegistry.addSvgIconLiteral('Maven',        sanitizer.bypassSecurityTrustHtml(MAVEN));
  }

  ngOnInit(): void {
    const allLevels = this.skillCategories.flatMap(c => c.skills.map(s => s.level));
    const totalSkills = allLevels.length;
    const overallAvg = Math.round(allLevels.reduce((a, b) => a + b, 0) / totalSkills);

    this.tabs = [
      { id: 'all', label: 'All Skills' },
      ...this.skillCategories.map(c => ({ id: c.id, label: c.label, color: c.color })),
    ];

    this.stats = [
      { label: 'Technologies',    value: totalSkills,        color: '#968ff9' },
      { label: 'Avg. Proficiency',value: `${overallAvg}%`,  color: '#b8a9ff' },
      { label: 'Categories',      value: this.skillCategories.length, color: '#c4b8ff' },
      { label: 'Yrs Experience',  value: '1.5+',             color: '#d4c8ff' },
    ];

    this.updateVisibleCategories();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.categoryRefs.forEach((ref, i) => {
        const cat = this.visibleCategoryList[i];
        if (!cat) return;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              this.visibleCategories.add(cat.id);
              this.cdr.markForCheck();
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(ref.nativeElement);
        this.observers.push(observer);
      });
    });
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
  }

  // ── Tab selection ──────────────────────────────────────────────────────────
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    this.updateVisibleCategories();
    this.observers.forEach(o => o.disconnect());
    this.observers = [];
    setTimeout(() => this.ngAfterViewInit());
    this.cdr.markForCheck();
  }

  private updateVisibleCategories(): void {
    this.visibleCategoryList = this.activeTab === 'all'
      ? this.skillCategories
      : this.skillCategories.filter(c => c.id === this.activeTab);
    
      // First category is always visible immediately on load
      if (this.visibleCategoryList.length > 0) {
      this.visibleCategories.add(this.visibleCategoryList[0].id);
    }
  }

  // ── Skill card flip ────────────────────────────────────────────────────────
  toggleSkill(key: string): void {
    const wasActive = this.activeSkill === key;
    this.activeSkill = wasActive ? null : key;
    if (!wasActive) this.startCounter(key);
    this.cdr.markForCheck();
  }

  onCardHover(key: string, entering: boolean): void {
    this.hoveredSkill = entering ? key : null;
    if (entering) this.startCounter(key);
    this.cdr.markForCheck();
  }

  isFlipped(catId: string, skillName: string): boolean {
    const key = `${catId}-${skillName}`;
    return this.activeSkill === key || this.hoveredSkill === key;
  }

  // ── Animated counter ───────────────────────────────────────────────────────
  private startCounter(key: string): void {
    if (this.countMap[key] !== undefined) return;
    const skill = this.skillCategories
      .flatMap(c => c.skills.map(s => ({ ...s, key: `${c.id}-${s.name}` })))
      .find(s => s.key === key);
    if (!skill) return;

    this.countMap[key] = 0;
    const target = skill.level;
    const duration = 900;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.countMap[key] = Math.floor(eased * target);
      this.cdr.markForCheck();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  getCount(catId: string, skillName: string): number {
    return this.countMap[`${catId}-${skillName}`] ?? 0;
  }

  // ── Style helpers ──────────────────────────────────────────────────────────
  isCategoryVisible(catId: string): boolean {
    return this.visibleCategories.has(catId);
  }

  getTabStyle(tab: { id: string; color?: string }): Record<string, string> {
    const isActive = this.activeTab === tab.id;
    const color = tab.color || '#968ff9';
    return {
      border:       `1px solid ${isActive ? color + '70' : '#1e1830'}`,
      background:   isActive ? `${color}10` : 'transparent',
      color:        isActive ? color : '#3d5470',
      'box-shadow': isActive ? `0 0 14px ${color}30` : 'none',
    };
  }

  getTagStyle(tag: string): TagStyle {
    return this.tagColors[tag] || this.tagColors['Advanced'];
  }

  getCategoryAvg(category: SkillCategory): number {
    return Math.round(category.skills.reduce((a, s) => a + s.level, 0) / category.skills.length);
  }

  getCategoryIconSvg(catId: string): SafeHtml {
    const icons: Record<string, string> = {
      frontend: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      backend:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      devops:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[catId] || '');
  }

  trackBySkill(_: number, skill: Skill): string    { return skill.name; }
  trackByCategory(_: number, cat: SkillCategory): string { return cat.id; }
  trackById(_: number, item: { id: string }): string { return item.id; }
}