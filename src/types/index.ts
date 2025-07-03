export interface Widget {
  id: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'button';
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  style?: {
    width?: string;
    height?: string;
    className?: string;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  widgets: Widget[];
  submitText?: string;
  onSubmit?: string; // Action to perform on submit
}

export interface Page {
  id: string;
  title: string;
  description?: string;
  forms: Form[];
  layout?: 'single' | 'grid' | 'tabs';
  style?: {
    backgroundColor?: string;
    padding?: string;
    maxWidth?: string;
  };
}

export interface AppConfig {
  title: string;
  pages: Page[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
} 