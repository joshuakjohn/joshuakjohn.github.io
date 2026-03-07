export interface Skill {
  name: string;
  level: number;
  years: string;
  tag: 'Expert' | 'Advanced';
  desc: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  color: string;
  glow: string;
  glowSoft: string;
  skills: Skill[];
}

export interface TagStyle {
  bg: string;
  border: string;
  text: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  color: string;
}