export type FieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'color' | 'list';

export interface SchemaField {
  id: string;
  label: string;
  type: FieldType;
  default?: any;
  // For 'list' types, define the schema of the list items
  itemSchema?: SchemaField[];
  // For 'list' types, an optional field ID to use as the title for each item in the UI
  itemTitleField?: string;
}

export interface ComponentSchema {
  name: string;        // Human readable name (e.g., "Hero Section")
  type: string;        // Unique ID matching the registry key (e.g., "hero")
  description?: string;
  settings: SchemaField[];
}

export interface SectionInstance {
  id: string;          // Unique instance ID (e.g., "hero-123")
  type: string;        // Component type from the registry
  settings: Record<string, any>;
}

export interface GlobalSettings {
  colors: {
    primary: string;           // e.g. #406900
    primaryContainer: string;  // e.g. #a2ff00
    background: string;        // e.g. #f9f9f9
    surface: string;           // e.g. #eeeeee
    text: string;              // e.g. #1a1c1c
    textVariant: string;       // e.g. #414a34
  };
}

export interface ThemeConfig {
  global: GlobalSettings;
  sections: SectionInstance[];
}

// Type that all registered components must adhere to
export interface SectionProps {
  settings: Record<string, any>;
  id: string; // The instance ID
}
