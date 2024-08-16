"use client";
import React, { useState, useEffect, useRef } from "react";
import { Popconfirm, Table, Tag, Button, Form, Input, Select, Modal, message } from "antd";
import axios from "../../axios";
import "./page.scss";
const { Search } = Input;
export default function JsonPage() {
  const localMenukey = localStorage.getItem("menukey");

  const menukey = useRef(localMenukey && localMenukey !== "" ? localMenukey : "stumgt");
  const modalType = useRef("add");
  const [formRef] = Form.useForm();
  const [tableData, settableData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [searchResult, setSearchResult] = useState([]);
  // const onFinish = (values) => {
  //   console.log("Received values of form:", values);
  // };

  const menuList = [
    {
      label: "全局 - app",
      value: "app",
    },
    {
      label: "首页 - dashboard",
      value: "dashboard",
    },
    {
      label: "学生管理 - stumgt",
      value: "stumgt",
    },
    {
      label: "收费管理 - feemgt",
      value: "feemgt",
    },
    {
      label: "教务管理 - teachaffairmgt",
      value: "teachaffairmgt",
    },
    {
      label: "营销管理 - mktmgt",
      value: "mktmgt",
    },
    {
      label: "开放平台 - openapi",
      value: "openapi",
    },
    {
      label: "基础设置 - basicset",
      value: "basicset",
    },
    {
      label: "通知公告 - announce",
      value: "announce",
    },
    {
      label: "租户管理 - tenantmgt",
      value: "tenantmgt",
    },
    {
      label: "统计报表 - statreport",
      value: "statreport",
    },
    {
      label: "活动中心 - activity",
      value: "activity",
    },

    {
      label: "登录页 - login",
      value: "login",
    },
    {
      label: "考试相关 - exam",
      value: "exam",
    },
    {
      label: "component组件相关 - component",
      value: "component",
    },
  ];

  // 添加字段方法
  const addFields = async (formValue) => {
    const { stringID, zhCN, enUS } = formValue;

    console.log("formValue = ", { ...formValue });
    return axios
      .post("addnew", { ...formValue, menuKey: menukey.current, modalType: modalType.current })
      .then((res) => {
        // console.log(res);
        if (res.data.code == 1) {
          let testKey = menukey.current + "." + stringID;
          let obj = localStorage.getItem("localesData");
          if (obj) {
            obj = JSON.parse(obj);
          }
          obj[testKey] = {
            enUS,
            zhCN,
          };

          let str = "{}";
          try {
            str = JSON.stringify(obj);
          } catch (error) {
            console.log("addFields stringify err = ", error);
            str = "{}";
          }

          localStorage.setItem("localesData", str);

          setModalVisible(false);
        } else {
          alert(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 编辑字段方法
  const editFields = (formValue) => {
    const { childCodeNm, childCodeEnNm } = formValue;
    // console.log("editFields currentEditInfo = ", currentEditInfo);
  };

  const handleAdd = () => {
    formRef.resetFields();
    modalType.current = "add";
    setModalVisible(true);
  };
  const handleEdit = (values) => {
    // console.log("handleEdit = ", values);

    modalType.current = "edit";
    formRef.setFieldsValue({
      enUS: values.enUS,
      stringID: values.stringID,
      zhCN: values.zhCN,
      stringID_back: values.stringID,
    });
    setModalVisible(true);
  };
  const handleDelete = async (values) => {
    console.log("handleDelete = ", values);

    const { stringID } = values;
    return axios
      .post("delete", { stringID, menuKey: menukey.current })
      .then((res) => {
        // console.log(res);
        if (res.data.code == 1) {
          return getDataBymenukey(menukey.current);
        } else {
          alert(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const modalCancel = () => {
    formRef.resetFields();
    setModalVisible(false);
  };
  function containsChineseCharacters(str) {
    const chineseRegex = /[\u4E00-\u9FA5]/;
    return chineseRegex.test(str);
  }
  const modalOk = () => {
    formRef
      .validateFields()
      .then((values) => {
        console.log("values = ", values);
        if (containsChineseCharacters(values.stringID)) {
          alert("stringID 不能有中文");
          return false;
        }

        let obj = localStorage.getItem("localesData");
        if (obj) {
          obj = JSON.parse(obj);
        }

        for (let key in obj) {
          if (obj[key].zhCN == values.zhCN) {
            message.info({ content: "已经有相同的中文 = " + key + " - " + JSON.stringify(obj[key]), duration: 5 });
            break;
          }
        }
        if (modalType.current == "edit") {
          let testKey = menukey.current + "." + values.stringID_back;
          if (obj[testKey]) {
            // editFields(values);
            return addFields(values);
          } else {
            message.error("找不到ID");
            return false;
          }
        } else {
          let testKey = menukey.current + "." + values.stringID;
          if (obj[testKey]) {
            message.error("ID重复");
            return false;
          } else {
            return addFields(values);
          }
        }
      })
      .then((obj) => {
        console.log("obj = ", obj);
        setModalVisible(false);
        return getDataBymenukey(menukey.current);
      })
      .catch((errorInfo) => {
        console.log("errorInfo = ", errorInfo);
      });
  };

  const columns = [
    {
      title: "stringID",
      dataIndex: "stringID",
      key: "stringID",
    },
    {
      title: "zh-CN",
      dataIndex: "zhCN",
      key: "zhCN",
    },
    {
      title: "en-US",
      dataIndex: "enUS",
      key: "enUS",
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 300,
      render: (v, o) => {
        return (
          <div className="actionDiv">
            <Button
              onClick={() => {
                handleEdit(o);
              }}
              type="primary"
            >
              编辑
            </Button>
            <Popconfirm
              title="提示"
              description={<div style={{ width: "160px", textAlign: "center" }}>确定要删除吗？</div>}
              onConfirm={() => {
                handleDelete(o);
              }}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const convertData = (object = {}) => {
    let arr = [];
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const element = object[key];
        let newKey = key;
        newKey = newKey.replace(menukey.current + ".", "");
        arr.push({
          key,
          stringID: newKey,
          zhCN: element.zhCN,
          enUS: element.enUS,
        });
      }
    }
    // console.log("convertData = ", arr);
    return arr;
  };
  const getDataBymenukey = async (key) => {
    return axios.get("getfile/" + key).then((res) => {
      if (res.data.data) {
        settableData(convertData(res.data.data));
      }
    });
  };
  const handleMenuChange = (e) => {
    console.log("e = ", e);
    menukey.current = e;
    localStorage.setItem("menukey", e);
    getDataBymenukey(e);
  };

  const getfileFun = (e) => {
    axios.get("getfile").then((res) => {
      // console.log("res = ", res);
      if (res.data.data) {
        let str = "{}";
        try {
          str = JSON.stringify(res.data.data);
        } catch (error) {
          console.log("getfile err = ", error);
          str = "{}";
        }

        localStorage.setItem("localesData", str);
      }
    });
  };
  useEffect(() => {
    getfileFun();

    getDataBymenukey(menukey.current);
  }, []);

  const onSearch = (value, event, source) => {
    console.log("onSearch = ", value, event, source);
    if (value == "") {
      setSearchResult([]);
    } else {
      let obj = localStorage.getItem("localesData");
      if (obj) {
        obj = JSON.parse(obj);
      }
      let arr = [];
      for (let key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          if (element.zhCN) {
            if (element.zhCN.indexOf(value) > -1) {
              arr.push({
                stringID: key,
                zhCN: element.zhCN,
                enUS: element.enUS,
              });
            }
          }
        }
      }
      setSearchResult(arr);
    }
  };
  function copyUsingOldMethod(text) {
    // 创建隐藏的可编辑元素
    const textarea = document.createElement("textarea");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    textarea.style.top = window.pageYOffset + "px";
    document.body.appendChild(textarea);

    // 设置文本内容
    textarea.value = text;

    // 选择文本并复制
    textarea.select();
    document.execCommand("copy");

    // 清理
    document.body.removeChild(textarea);
  }
  const copyText = (event, str) => {
    // console.log("navigator.clipboard = ", navigator.clipboard);
    if (navigator.clipboard && "writeText" in navigator.clipboard) {
      navigator.clipboard
        .writeText(str)
        .then(() => {
          // console.log('Text copied to clipboard successfully!');
        })
        .catch((error) => {
          console.error("Failed to copy using clipboard API:", error);
          // 如果API失败，回退到旧方法
          copyUsingOldMethod(str);
        });
    } else {
      // 对于不支持navigator.clipboard API的浏览器，使用旧方法
      copyUsingOldMethod(str);
    }
  };
  return (
    <>
      <div className="pageBox">
        <div className="searchBox">
          <div className="searchFlexBox">
            <span className="lable">
              按zh-CN中文字段搜索，<b>做了新增、编辑、删除操作后，需要刷新页面再查询</b>：
            </span>
            <Search defaultValue="" className="searchInput" allowClear onSearch={onSearch} />
          </div>
          <div className="menuItemTitle">搜索结果：</div>
          <ul className="menuItem">
            {searchResult.map((item) => {
              return (
                <li key={item.stringID}>
                  <span
                    className="clickSpan"
                    onClick={(event) => {
                      event.preventDefault();
                      const str = "formatMessage({ id: '" + item.stringID + "' })";
                      copyText(event, str);
                    }}
                  >
                    {item.stringID}
                  </span>
                  - {item.zhCN} -{" "}
                  <span
                    onClick={(event) => {
                      event.preventDefault();
                      copyText(event, item.stringID);
                    }}
                  >
                    {item.enUS}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="actionBox">
          选择菜单：
          <Select
            defaultValue={menukey.current}
            popupClassName="menuOpt"
            options={menuList}
            onChange={handleMenuChange}
          ></Select>
          <Button onClick={handleAdd} type="primary">
            添加新字段
          </Button>
        </div>

        <Table columns={columns} dataSource={tableData} />
      </div>
      <Modal title="新增 / 编辑 字段" open={modalVisible} onCancel={modalCancel} onOk={modalOk}>
        <Form autoComplete="off" form={formRef}>
          <div style={{ marginBottom: 16 }}> 当前菜单key : {menukey.current}</div>
          <Form.Item name={"stringID_back"} initialValue="" hidden></Form.Item>
          <Form.Item
            name={"stringID"}
            initialValue=""
            rules={[
              {
                required: true,
                message: "请输入唯一ID，不需要输入前缀",
              },
            ]}
          >
            <Input placeholder="请输入唯一ID，不需要输入前缀" />
          </Form.Item>
          <Form.Item
            name={"zhCN"}
            initialValue=""
            rules={[
              {
                required: true,
                message: "请输入zhCN 中文",
              },
            ]}
          >
            <Input placeholder="zhCN 中文" />
          </Form.Item>
          <Form.Item
            name={"enUS"}
            initialValue=""
            rules={[
              {
                required: true,
                message: "请输入enUS 英文",
              },
            ]}
          >
            <Input placeholder="enUS 英文" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
