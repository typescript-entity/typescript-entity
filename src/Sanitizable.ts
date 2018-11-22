export interface Sanitizable {
  sanitize: () => this;
  sanitizeValue: (key: any, value: any) => any;
}
