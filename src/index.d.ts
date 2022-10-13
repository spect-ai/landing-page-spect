export interface FormType {
  name: string;
  slug: string;
  private: boolean;
  description: string;
  properties: {
    [key: string]: {
      type: string;
      name: string;
      default: string;
      isPartOfFormView: boolean;
      options?: {
        label: string;
        value: string;
      }[];
    };
  };
  propertyOrder: string[];
  creator: string;
  parents: {
    id: string;
    name: string;
    slug: string;
  }[];
  defaultView: string;
  formRoleGating: number[];
  canFillForm: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}
