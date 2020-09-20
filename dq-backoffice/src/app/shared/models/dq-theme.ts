export interface DqTheme {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  company: DqCompany;
}

export interface DqCompany {
  _id: string;
  name: string;
  subname: string;
}
