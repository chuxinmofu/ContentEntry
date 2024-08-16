import component from "./en-US/component.js";
import menu from "./en-US/menu.js";
// import settings from "./en-US/settings.js";
import login from "./en-US/login.js";
import app from "./en-US/app.js";
import dashboard from "./en-US/dashboard.js";
import exam from "./en-US/exam.js";
import feemgt from "./en-US/feemgt.js";
import stumgt from "./en-US/stumgt.js";
import teachaffairmgt from "./en-US/teachaffairmgt.js";
import mktmgt from "./en-US/mktmgt.js";
import openapi from "./en-US/openapi.js";
import basicset from "./en-US/basicset.js";
import announce from "./en-US/announce.js";
import tenantmgt from "./en-US/tenantmgt.js";
import statreport from "./en-US/statreport.js";
import activity from "./en-US/activity.js";

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
