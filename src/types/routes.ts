export interface RouteDataInterface {
  name: string;
  path?: string;
  query?: string;
  key: string;
  parentKey?: string;
  accessRole: string[];
  renderInMenu?: boolean;
  icon?: JSX.Element;
  children?: RouteDataInterface[];
}