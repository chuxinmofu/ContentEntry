// const express = require("express");
import express from "express";
import mfs from "fs";
import http from "http";
// import path from "path";
import cors from "cors";
import menuListName from "./menuconfig.js";
import bodyParser from "body-parser";
// import _ from "lodash";
const fs = mfs.promises;

const app = express();
const port = 3100;
app.use(cors());
app.use(bodyParser.json());
// 设置静态文件目录
app.use("/static", express.static("locales"));

app.post("/delete", async (req, res) => {
  const { stringID, menuKey } = req.body;
  if (!!stringID && !!menuKey) {
    const isMenu = menuListName[menuKey];
    if (!isMenu) {
      res.send({ code: 0, data: null, msg: "菜单不存在" });
      return false;
    }
    let en = (await import("./locales/en-US/" + menuKey + ".js")).default;
    let cn = (await import("./locales/zh-CN/" + menuKey + ".js")).default;

    delete en[menuKey + "." + stringID];
    delete cn[menuKey + "." + stringID];

    let content = JSON.stringify(en, null, 2);
    content = "export default " + content;
    try {
      await fs.writeFile("./locales/en-US/" + menuKey + ".js", content, "utf8");
    } catch (error) {
      res.send({ code: 0, msg: error });
    }

    let contentcn = JSON.stringify(cn, null, 2);
    contentcn = "export default " + contentcn;
    try {
      await fs.writeFile("./locales/zh-CN/" + menuKey + ".js", contentcn, "utf8");
    } catch (error) {
      res.send({ code: 0, msg: error });
    }
    res.send({ code: 1, msg: "删除成功" });
  } else {
    res.send({ code: 0, msg: "参数错误" });
  }
});
app.post("/addnew", async (req, res) => {
  // console.log(req.body);
  const { stringID, zhCN, enUS, menuKey, stringID_back, modalType } = req.body;

  const isMenu = menuListName[menuKey];
  if (!isMenu) {
    res.send({ code: 0, data: null, msg: "菜单不存在" });
    return false;
  }
  if (!!stringID && !!zhCN && !!enUS && !!menuKey) {
    let en = (await import("./locales/en-US/" + menuKey + ".js")).default;
    let cn = (await import("./locales/zh-CN/" + menuKey + ".js")).default;
    // console.log("en = ", en);
    // console.log("cn = ", cn);
    if (modalType == "edit" && stringID != stringID_back) {
      //做了修改动作
      delete en[menuKey + "." + stringID_back];
      delete cn[menuKey + "." + stringID_back];
    }

    en[menuKey + "." + stringID] = enUS;

    let content = JSON.stringify(en, null, 2);
    content = "export default " + content;
    // let menuKey1 = "cc";
    try {
      await fs.writeFile("./locales/en-US/" + menuKey + ".js", content, "utf8");
    } catch (error) {
      res.send({ code: 0, msg: error });
    }

    cn[menuKey + "." + stringID] = zhCN;

    let contentcn = JSON.stringify(cn, null, 2);
    contentcn = "export default " + contentcn;
    try {
      await fs.writeFile("./locales/zh-CN/" + menuKey + ".js", contentcn, "utf8");
    } catch (error) {
      res.send({ code: 0, msg: error });
    }
    res.send({ code: 1, msg: "添加成功" });
  } else {
    res.send({ code: 0, msg: "参数错误" });
  }
});

app.get("/getfile", async (req, res) => {
  const cn = (await import(`./locales/zh-CN.js`)).default;
  const en = (await import(`./locales/en-US.js`)).default;

  let cnkeys = Object.keys(cn);
  let newObj = {};
  if (cnkeys.length == 0) {
    res.send({ code: 1, data: [], msg: "没有中文数据" });
  } else {
    cnkeys.forEach((item) => {
      newObj[item] = {
        enUS: en[item] || "",
        zhCN: cn[item],
      };
    });
    res.send({ code: 1, data: newObj });
  }
});
app.get("/getfile/:filename", async (req, res) => {  
  const filename = req.params.filename;  
  const isMenu = menuListName[filename];  
  
  if (isMenu) {  
    try {  
      const en = (await import(`./locales/en-US/${filename}.js`)).default;  
      const cn = (await import(`./locales/zh-CN/${filename}.js`)).default;  
  
      let newObj = {};  
      Object.keys(cn).forEach((item) => {  
        newObj[item] = {  
          enUS: en[item] || "",  
          zhCN: cn[item],  
        };  
      });  
  
      res.status(200).send({ code: 0, data: newObj, msg: "数据获取成功" });  
    } catch (error) {  
      res.status(500).send({ code: -1, msg: "内部服务器错误" });  
    }  
  } else {  
    res.status(404).send({ code: 0, data: null, msg: "菜单不存在" });  
  }  
});  
app.get("/getmenu", (req, res) => {
  res.json(menuListName);
});
// 启动HTTP服务器
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
