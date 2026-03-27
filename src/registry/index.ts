import { ComponentSchema, FieldType } from '@/types/theme';
import dynamic from 'next/dynamic';

export const HeroSchema: ComponentSchema = {
  name: 'Hero Section',
  type: 'hero',
  description: 'The main landing area for the top of the page.',
  settings: [
    { id: 'badge', label: 'Badge Text', type: 'text', default: 'New Update' },
    { id: 'title', label: 'Heading (HTML)', type: 'richtext', default: 'Heading' },
    { id: 'description', label: 'Description', type: 'textarea', default: 'Short description' },
    { id: 'cta', label: 'Primary CTA Text', type: 'text', default: 'Click Here' },
    { id: 'ctaLink', label: 'Primary CTA Link', type: 'text', default: '#' },
    { id: 'secondaryCta', label: 'Secondary CTA Text', type: 'text', default: 'Learn More' },
    { id: 'secondaryCtaLink', label: 'Secondary CTA Link', type: 'text', default: '#' },
    { id: 'image', label: 'Background Image URL', type: 'image', default: '' },
    { id: 'imageAlt', label: 'Image Alt Text', type: 'text', default: 'Image' },
  ],
};

export const WinsSchema: ComponentSchema = {
  name: 'Victory Lap (Wins)',
  type: 'wins',
  description: 'A grid of achievement cards.',
  settings: [
    { id: 'title', label: 'Section Title', type: 'text', default: 'Wins' },
    { id: 'stamp', label: 'Stamp/Subtitle', type: 'text', default: 'ARCHIVE' },
    {
      id: 'cards',
      label: 'Win Cards',
      type: 'list',
      itemTitleField: 'title',
      itemSchema: [
        { id: 'badge', label: 'Card Badge', type: 'text', default: 'Badge' },
        { id: 'title', label: 'Card Title', type: 'text', default: 'New Win' },
        { id: 'description', label: 'Description', type: 'textarea', default: 'Details' },
        { id: 'status', label: 'Status Text', type: 'text', default: 'Status: Complete' },
      ],
    },
  ],
};

export const GarageSchema: ComponentSchema = {
  name: 'The Garage',
  type: 'garage',
  description: 'Horizontal gallery of sketches/images.',
  settings: [
    { id: 'title', label: 'Section Title', type: 'text', default: 'Garage' },
    { id: 'stamp', label: 'Stamp/Subtitle', type: 'text', default: 'CATALOG' },
    {
      id: 'items',
      label: 'Gallery Items',
      type: 'list',
      itemTitleField: 'label',
      itemSchema: [
        { id: 'image', label: 'Image URL', type: 'image', default: '' },
        { id: 'label', label: 'Label', type: 'text', default: '#NEW' },
        { id: 'alt', label: 'Alt Text', type: 'text', default: 'Alt' },
      ],
    },
  ],
};

export const JoinSchema: ComponentSchema = {
  name: 'Join / Contact',
  type: 'join',
  description: 'Application form section.',
  settings: [
    { id: 'title', label: 'Section Title', type: 'richtext', default: 'Join' },
    { id: 'stamp', label: 'Stamp/Subtitle', type: 'text', default: 'DOC-ID' },
    { id: 'description', label: 'Intro Description', type: 'richtext', default: 'intro...' },
  ],
};

export const FooterSchema: ComponentSchema = {
  name: 'Footer',
  type: 'footer',
  description: 'Site footer with links.',
  settings: [
    { id: 'brand', label: 'Brand Name', type: 'text', default: 'Brand' },
    { id: 'copyright', label: 'Copyright Text', type: 'text', default: '© 2024' },
    {
      id: 'socialLinks',
      label: 'Social Links',
      type: 'list',
      itemTitleField: 'label',
      itemSchema: [
        { id: 'label', label: 'Link Label', type: 'text', default: 'Link' },
        { id: 'href', label: 'URL', type: 'text', default: '#' },
      ],
    },
  ],
};

export const NavbarSchema: ComponentSchema = {
  name: 'Navigation Bar',
  type: 'navbar',
  description: 'Top navigation bar.',
  settings: [
    { id: 'brand', label: 'Brand Name', type: 'text', default: 'Brand' },
    {
      id: 'links',
      label: 'Menu Links',
      type: 'list',
      itemTitleField: 'label',
      itemSchema: [
        { id: 'label', label: 'Link Label', type: 'text', default: 'Link' },
        { id: 'href', label: 'URL (e.g. #hero)', type: 'text', default: '#' },
      ],
    },
  ],
};

export const TickerSchema: ComponentSchema = {
  name: 'Ticker Tape',
  type: 'ticker',
  description: 'Scrolling text marquee.',
  settings: [
    {
      id: 'items',
      label: 'Ticker Phrases',
      type: 'list',
      itemTitleField: 'text',
      itemSchema: [
        { id: 'text', label: 'Phrase', type: 'text', default: 'PHRASE' }
      ]
    }
  ],
};

// Map schemas for easy lookup in the Editor
export const componentSchemas: Record<string, ComponentSchema> = {
  hero: HeroSchema,
  wins: WinsSchema,
  garage: GarageSchema,
  join: JoinSchema,
  footer: FooterSchema,
  navbar: NavbarSchema,
  ticker: TickerSchema,
};

// Map dynamic components for rendering
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  hero: dynamic(() => import('@/components/HeroSection')),
  wins: dynamic(() => import('@/components/WinsSection')),
  garage: dynamic(() => import('@/components/GarageSection')),
  join: dynamic(() => import('@/components/JoinSection')),
  footer: dynamic(() => import('@/components/Footer')),
  navbar: dynamic(() => import('@/components/Navbar')),
  ticker: dynamic(() => import('@/components/TickerTape')),
};
