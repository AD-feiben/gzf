const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
let config = require('./config.json');

const api = require('./api');
const NodeRSA = require('node-rsa');

async function getInfo(key, cookie) {
  const rsa = new NodeRSA(key, { encryptionScheme: 'pkcs1' });
  const { waitTpye, bahzh, xingm, sfz } = config;
  const params = {
    pageNumber: 1,
    pageSize: 2,
    waitTpye,
    bahzh: rsa.encrypt(bahzh, 'base64'),
    xingm: rsa.encrypt(xingm, 'base64'),
    sfz: rsa.encrypt(sfz, 'base64')
  };

  return await api.queryLhmcInfo1(params, {
    'Cookie': cookie
  });
}

async function notify(data) {
  const { PAIX, AREA_PAIX } = data;

  if (config.AREA_PAIX === AREA_PAIX && config.PAIX === PAIX) return;

  const OLD_PAIX = config.PAIX;
  const OLD_AREA_PAIX = config.AREA_PAIX;
  const DETAIL_PAIX = config.PAIX - PAIX;
  const DETAIL_AREA_PAIX = config.AREA_PAIX - AREA_PAIX;

  updateConfig({ PAIX, AREA_PAIX });

  if (OLD_PAIX === 0 && OLD_AREA_PAIX === 0) return;

  await api.notify({
    text: `【公租房更新提醒】轮候排序号: ${PAIX}`,
    desp: `
    轮候排序号: ${PAIX}， ${DETAIL_PAIX >= 0 ? '上升' : '下降'} ${DETAIL_PAIX}

    户籍区排序号: ${AREA_PAIX}， ${DETAIL_AREA_PAIX >= 0 ? '上升' : '下降'} ${DETAIL_AREA_PAIX}`
  });
}


async function run () {
  try {
    const res = await api.getKey();
    const cookie = res.headers['set-cookie'].map(item => {
      return item.split(';')[0];
    });

    const key = `-----BEGIN PUBLIC KEY-----
    ${res.data}
    -----END PUBLIC KEY-----`;

    const { data } = await getInfo(key, cookie.join('; '));
    const result = data.rows && data.rows[0];
    if (result) {
      await notify(result);
    } else {
      console.error(`查询异常`, data);
    }
  } catch (err) {
    console.error(err);
  }
}

function updateConfig (data) {
  config = Object.assign({}, config, data);
  fs.writeFileSync(path.resolve('./config.json'), JSON.stringify(config, null, 4));
}

const  scheduleCronstyle = ()=>{
  // 每天上午 10点 查询是否更新
  schedule.scheduleJob('0 0 10 * * *', run);
}

scheduleCronstyle();
