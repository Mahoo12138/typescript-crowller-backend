import fs from "fs";
import path from "path";
import MyAnalyzer from './analyzer'

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, "../data/course.json");

  async getRawHtml() {
    // const result = await superagent.get(this.analyzer.url);
    // return result.text;
    return "test";
  }

  writeDataFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  async initCrowllerProcess() {
    const result = await this.getRawHtml();
    const content = this.analyzer.analyze(result, this.filePath);
    this.writeDataFile(content);
  }

  constructor(private analyzer: MyAnalyzer) {
    this.initCrowllerProcess();
  }
}

export default Crowller;
