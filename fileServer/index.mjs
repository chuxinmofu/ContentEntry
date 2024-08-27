import express from "express";
import mfs from "fs";
import http from "http";
import cors from "cors";
import menuListName from "./menuconfig.js";
import bodyParser from "body-parser";
const fs = mfs.promises;

const app = express();
const port = 3100;
app.use(cors());
app.use(bodyParser.json());

app.use("/static", express.static("locales"));

app.post("/delete", async (req, res) => {
  const { stringID, menuKey } = req.body;

  if (!stringID || !menuKey) {
    return res.status(400).json({ code: 1, msg: "参数错误" });
  }

  const isMenu = menuListName[menuKey];
  if (!isMenu) {
    return res.status(400).json({ code: 1, data: null, msg: "菜单不存在" });
  }

  try {

    let en = (await import("./locales/en-US/" + menuKey + ".js")).default;
    let cn = (await import("./locales/zh-CN/" + menuKey + ".js")).default;

    delete en[menuKey + "." + stringID];
    delete cn[menuKey + "." + stringID];

    const enContent = `export default ${JSON.stringify(en, null, 2)}`;
    await fs.writeFile("./locales/en-US/" + menuKey + ".js", enContent, "utf8");

    const cnContent = `export default ${JSON.stringify(cn, null, 2)}`;
    await fs.writeFile("./locales/zh-CN/" + menuKey + ".js", cnContent, "utf8");

    res.json({ code: 0, msg: "删除成功" });
  } catch (error) {
    res.status(500).json({ code: 1, msg: error.message || "内部服务器错误" });
  }
});

app.post("/addnew", async (req, res) => {
  const { stringID, zhCN, enUS, menuKey, modalType } = req.body;
  const isMenu = menuListName[menuKey];

  if (!isMenu) {
    return res.status(400).json({ code: 1, data: null, msg: "菜单不存在" });
  }

  if (!stringID || !zhCN || !enUS || !menuKey) {
    return res.status(400).json({ code: 1, msg: "参数错误" });
  }

  try {
    let en = (await import("./locales/en-US/" + menuKey + ".js")).default;
    let cn = (await import("./locales/zh-CN/" + menuKey + ".js")).default;

    if (modalType === "edit") {
      delete en[menuKey + "." + stringID];
      delete cn[menuKey + "." + stringID];
    }

    en[menuKey + "." + stringID] = enUS;
    cn[menuKey + "." + stringID] = zhCN;

    const enContent = `export default ${JSON.stringify(en, null, 2)}`;
    const cnContent = `export default ${JSON.stringify(cn, null, 2)}`;

    await Promise.all([
      fs.writeFile("./locales/en-US/" + menuKey + ".js", enContent, "utf8"),
      fs.writeFile("./locales/zh-CN/" + menuKey + ".js", cnContent, "utf8")
    ]);

    res.json({ code: 0, msg: "添加成功" });
  } catch (error) {
    res.status(500).json({ code: 1, msg: error.message || "内部服务器错误" });
  }
});

app.get("/getfile", async (req, res) => {
  try {
    const cn = (await import(`./locales/zh-CN.js`)).default;
    const en = (await import(`./locales/en-US.js`)).default;

    if (!cn || Object.keys(cn).length === 0) {
      res.status(400).send({ code: 0, msg: "没有中文数据" });
      return;
    }

    const newObj = Object.keys(cn).reduce((acc, item) => {
      acc[item] = {
        enUS: en[item] || "",
        zhCN: cn[item],
      };
      return acc;
    }, {});

    res.status(200).send({ code: 0, data: newObj, msg: "数据获取成功" });
  } catch (error) {
    console.error("Error loading locales:", error);
    res.status(500).send({ code: -1, msg: "内部服务器错误" });
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
