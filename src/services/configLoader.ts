import yaml from 'js-yaml';
import type { AppConfig } from '../types';

export class ConfigLoader {
  private static instance: ConfigLoader;
  private config: AppConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  async loadConfig(configPath: string = '/config.yaml'): Promise<AppConfig> {
    try {
      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      
      const yamlText = await response.text();
      const parsedConfig = yaml.load(yamlText) as AppConfig;
      
      // Validate the config structure
      this.validateConfig(parsedConfig);
      
      this.config = parsedConfig;
      return parsedConfig;
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw error;
    }
  }

  getConfig(): AppConfig | null {
    return this.config;
  }

  private validateConfig(config: any): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration: must be an object');
    }

    if (!config.title || typeof config.title !== 'string') {
      throw new Error('Invalid configuration: title is required and must be a string');
    }

    if (!Array.isArray(config.pages)) {
      throw new Error('Invalid configuration: pages must be an array');
    }

    config.pages.forEach((page: any, index: number) => {
      if (!page.id || !page.title || !Array.isArray(page.forms)) {
        throw new Error(`Invalid page at index ${index}: id, title, and forms array are required`);
      }

      page.forms.forEach((form: any, formIndex: number) => {
        if (!form.id || !form.title || !Array.isArray(form.widgets)) {
          throw new Error(`Invalid form at page ${page.id}, form index ${formIndex}: id, title, and widgets array are required`);
        }

        form.widgets.forEach((widget: any, widgetIndex: number) => {
          if (!widget.id || !widget.type) {
            throw new Error(`Invalid widget at page ${page.id}, form ${form.id}, widget index ${widgetIndex}: id and type are required`);
          }
        });
      });
    });
  }
} 