const axios = require("axios");
const querystring = require("querystring");
const config = require("../config.json");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_SEND, // generated ethereal user
    pass: config.EMAIL_PASS, // generated ethereal password
  },
});

exports.sendEmail = async ({ text, desp }) => {
  return transporter.sendMail({
    from: `[公租房更新提醒]<${config.EMAIL_SEND}>`, // sender address
    to: config.EMAIL_TO, // list of receivers
    subject: text, // Subject line
    text: desp, // plain text body
  });
};

exports.notify = ({ text, desp }) => {
  return new Promise((resolve, reject) => {
    /** https://sct.ftqq.com/forward  获取 BarkApi */
    // const url = `${config.BarkApi}/${text}\n${desp}/${text}\n${desp}`;

    // https://sctapi.ftqq.com/****************.send?title=messagetitle&desp=messagecontent
    const url = `https://sctapi.ftqq.com/${config.SCKEY}.send?title=${text}&desp=${desp}`;
    console.log(url);
    axios
      .get(encodeURI(url))
      .then(({ data }) => {
        if (data.errno === 0) {
          return resolve(data);
        }
        reject(data);
      })
      .catch((err) => reject(err));
  });
};

const axiosInstance = axios.create({
  baseURL: "http://zjj.sz.gov.cn/",
  headers: {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    Host: "zjj.sz.gov.cn",
    Pragma: "no-cache",
    Referer:
      "http://zjj.sz.gov.cn/bzflh//jsplib/lhccx/singlelhc_query1.jsp?code=b734e549fee1b0622a4c5781f248336e",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

exports.getKey = () => {
  return axiosInstance.get("/bzflh/lhmcAction.do", {
    params: {
      method: "getKey",
      _: Date.now(),
    },
  });
};

exports.queryLhmcInfo1 = (data, headers) => {
  return axiosInstance.post(
    "/bzflh/lhmcAction.do?method=queryLhmcInfo1",
    querystring.stringify(data),
    {
      headers,
    }
  );
};
