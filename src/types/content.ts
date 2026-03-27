export interface NavLink {
  label: string;
  href: string;
}

export interface NavContent {
  brand: string;
  links: NavLink[];
}

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  secondaryCta: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
}

export interface WinCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  status: string;
}

export interface WinsContent {
  title: string;
  stamp: string;
  cards: WinCard[];
}

export interface GarageItem {
  id: string;
  image: string;
  label: string;
  alt: string;
}

export interface GarageContent {
  title: string;
  stamp: string;
  items: GarageItem[];
}

export interface JoinContent {
  title: string;
  stamp: string;
  description: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterContent {
  brand: string;
  copyright: string;
  socialLinks: SocialLink[];
}

export interface SiteContent {
  nav: NavContent;
  hero: HeroContent;
  ticker: string[];
  wins: WinsContent;
  garage: GarageContent;
  join: JoinContent;
  footer: FooterContent;
}
