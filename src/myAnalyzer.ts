import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { Analyzer } from './crowller';

interface Course {
  title: string;
  count: number;
}
interface CourseResult {
  time: number;
  data: Course[];
}
interface Content {
  [propsName: number]: Course[];
}

export default class MyAnalyzer implements Analyzer {
  private _url:string = "http://xxx.com/data";

  get url(){
    return this._url;
  }

  analyze(html: string,filePath:string) {
    const courseInfo:CourseResult = this.getCourseInfo(html);
    return this.generateJsonContent(courseInfo,filePath);
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItem = $(".course-item");
    const courseInfos: Course[] = [];
    courseItem.map((index, element) => {
      const desc = $(element).find(".course-desc");
      const title = desc.eq(0).text();
      const count = parseInt(desc.eq(1).text().split("：")[1], 10);
      courseInfos.push({
        title,
        count,
      });
    });
    return {
      time: new Date().getTime(),
      data: courseInfos,
    };
  }
  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return JSON.stringify(fileContent);
  }
}
