export interface Validatable {
  validate: () => this;
  validateValue: (key: any, value: any) => true;
};
