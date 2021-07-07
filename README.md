# 轮候信息查询（深圳）

## 配置


```json
{
    // 1：安居房， 2：公租房
    "waitTpye": "2",
    // 备案回执号
    "bahzh": "",
    // 姓名
    "xingm": "",
    // 身份证号
    "sfz": "",
    // 轮候排序号
    "PAIX": 0,
    // 户籍区排序号
    "AREA_PAIX": 0,
    // 方糖通知 http://sc.ftqq.com/?c=code 获取（无法使用）
    "SCKEY": "",
    // 方糖通知 https://sct.ftqq.com/forward 获取
    "BarkApi": ""
}
```

## 安装依赖

```bash
npm install

#OR

yarn install
```

pm2 为全局依赖

```bash
npm install pm2 -g
```

## 启动

```bash
npm run start

# OR

yarn start
```

## 关闭

```bash
npm run kill

# OR

yarn kill
```