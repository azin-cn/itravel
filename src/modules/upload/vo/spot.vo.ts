export class UploadVO {
  /**
   * 文件url
   */
  url: string;

  /**
   * 文件名
   */
  name: string;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
  }
}
