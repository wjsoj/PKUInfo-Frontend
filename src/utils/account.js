import CryptoES from 'crypto-es';
import axios from 'axios';

const md5 = (string) => {
  return CryptoES.MD5(string).toString()
}

const generateSign = (data) => {
  const currentTime = Math.round(new Date() / 1000);
  const key = "d4cf4238a0b943820dcc509a6f75847a";
  
  const requestData = {
    key: key,
    time: currentTime,
    ...data
  };

  const sortedData = {};
  Object.keys(requestData)
    .sort()
    .forEach((key) => {
        sortedData[key] = requestData[key];
    });

  let concatenatedString = "";
  for (const key in sortedData) {
    concatenatedString += `${key}=${sortedData[key]}&`;
  }
  concatenatedString = concatenatedString.slice(0, -1);
  concatenatedString += "38c8edde3f61a0411512d3b1866f0647";

  const sign = md5(decodeURI(concatenatedString));
  console.log("sign:", sign);
  console.log("time:", currentTime);
  return {sign,currentTime};
};

export function getAccount(name) {
  // https://m.gsdata.cn/api/account/search/list
  let params = {
    platform_name: "微信",
    media_name: name,
    page: 1,
    num: 10,
  }
  const {sign,currentTime} = generateSign(params);
  // https://m.gsdata.cn/api/account/search/list
  axios.defaults.withCredentials = true;
  return axios.get("/account", {
    params: {
      ...params,
    },
    headers: {
      sign: sign,
      time: currentTime,
      type: "mobile",
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export default {getAccount};