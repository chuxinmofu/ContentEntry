import component from "./zh-CN/component.js";
import menu from "./zh-CN/menu.js";
// import settings from "./zh-CN/settings.js";
import login from "./zh-CN/login.js";
import app from "./zh-CN/app.js";
import dashboard from "./zh-CN/dashboard.js";
import exam from "./zh-CN/exam.js";
import feemgt from "./zh-CN/feemgt.js";
import stumgt from "./zh-CN/stumgt.js";
import teachaffairmgt from "./zh-CN/teachaffairmgt.js";
import mktmgt from "./zh-CN/mktmgt.js";
import openapi from "./zh-CN/openapi.js";
import basicset from "./zh-CN/basicset.js";
import announce from "./zh-CN/announce.js";
import tenantmgt from "./zh-CN/tenantmgt.js";
import statreport from "./zh-CN/statreport.js";
import activity from "./zh-CN/activity.js";

export default {
  ...component,
  ...menu,
  // ...settings,
  ...exam,
  ...app,
  ...login,
  ...stumgt,
  ...dashboard,

  ...feemgt,
  ...teachaffairmgt,
  ...mktmgt,
  ...openapi,
  ...basicset,
  ...announce,
  ...tenantmgt,
  ...statreport,
  ...activity,
};
