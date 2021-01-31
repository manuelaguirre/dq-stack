export interface DqCompany {
  _id?: string;
  name: string;
  subname: string;
}

export interface DqTheme {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  isDefault: boolean;
  company: DqCompany;
}
