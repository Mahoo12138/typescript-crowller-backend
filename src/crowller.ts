import superagent from "superagent";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { throws } from 'assert';

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

class Crowller {
  private url = "http://xxx.com/data";

  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }
  getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItem = $(".course-item");
    const courseInfos:Course[] = [];
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
  generateJsonContent(courseInfo: CourseResult) {
    const filePath = path.resolve(__dirname, "../date/course.json");
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }

  async initCrowllerProcess(){
    const result = await this.getRawHtml();
    const courseInfo = this.getCourseInfo(result);
    this.generateJsonContent(courseInfo);
  }

  constructor(){
    this.initCrowllerProcess();
  }
}

new Crowller()
