export class DirectoryInfo {
  constructor(
    public path: string,
    public type: string,
    public drives: string[] = [],
    public files: { name: string; type: string }[] = []
  ) {}
}