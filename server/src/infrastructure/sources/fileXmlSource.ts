import fs from "fs/promises"

export class FileXmlSource {
  constructor(private filePath: string) {}

  async read(): Promise<string> {
    return fs.readFile(this.filePath, "utf-8")
  }
}