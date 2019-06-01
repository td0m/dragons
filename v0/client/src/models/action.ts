export interface Action {
  type: string;
  payload?: any;

  [key: string]: any;
}
