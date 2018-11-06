import axios from "./interceptors";

const { assign } = Object,
      DEFAULTS = {
            source: 0, //来源     默认微信
            type  : 1  //地址类型  默认跨越
      };

//通用配置
const fetch = config => {
    //默认配置
    var setting = {
        url: "",
        data: {},
        method: "post",
        timeout: 10000,
        //baseURL: "/api",
        baseURL: 'https://sxapi.ky-express.com/api/'    //正式环境
        //baseURL: "http://testsxapi.ky-express.com/api/"   //测试环境
        //baseURL: "http://172.20.2.120/api/"             //测试环境
    };

    //覆盖默认配置
    assign(setting, config);

    return new Promise(resolve => {
        axios(setting).then(response => {
            resolve(response);
        })
        //此处异常在响应拦截器内处理
    });
};


//商品列表
const queryGLGoodsList = data => {
    const { user, merchantCode } = data;
    return fetch({
        data:user,
        url: `${1}/${100}/${merchantCode}/queryGLGoodsList`
    });
};

//商品详情
const queryGLGoodsDetail = data => {
    const { skuno, user, merchantCode } = data;
    return fetch({
        data:user,
        url: `${merchantCode}/${skuno}/queryGLGoodsDetail`
    });
};


//查询地址列表
//参数：
// uuid   登录uuid
// phone  登录用户
// source 来源
// type   类型
const historyAddress = data => {
    return fetch({
        data,
        url: `gree/${DEFAULTS.type}/${DEFAULTS.source}/historyAddress`
    });
}

//查询省市区
// uuid    登录uuid
// phone   登录用户
// provinc 省
// county  市
// area    区
// 省市区传空，查询省；传省，查询市；传省市，查询区
const queryAddress = data => {
    return fetch({
        data,
        url: 'gree/queryAddress'
    });
}

//新增 || 修改
// phone      : '登录用户',
// uuid       : "11ee1bb8-c258-442d-8dee-a9834fbf963b", 登录uuid
// revicePhone: "13537608122", 收件手机
// reviceName : "收件人名",
// address    : "详细地址",
// provinceStr: 省
// cityStr    : 市,
// countryStr : 区,
// townStr    : "", 县 传空
// province   : "0", 省  写死
// country    : "0", 市  写死
// city       : "0", 区  写死
// source     : "0", 来源 0微信 写死
// type       : "1", 类型 1跨越 写死
// id         : 0或不传为新增，修改时传地址列表查询出来的id值,
const addOrUpdateAddress = data => {
    //固定参数
    var setting = {
        province: 0,   //省
        city    : 0,   //市
        country : 0,   //区
        townStr : '',  //县
    };

    return fetch({
        data: assign({},setting, data, DEFAULTS),
        url: 'gree/addOrUpdateAddress'
    });
}

//设置为默认地址
//参数：
//source 来源 默认传0（微信）
//type   类型 默认传1（跨越）
//id
//uuid
//phone
const setDefaultAddress = (user, id) => {
    return fetch({
        data: assign({},DEFAULTS, user, { id: id }),
        url:'gree/setDefaultAddress'
    })
}

//删除地址
//参数：
//source 来源 默认传0（微信）
//type   类型 默认传1（跨越）
//id
//uuid
//phone
const delHistoryAddress = (user, id) => {
    return fetch({
        data: assign({},DEFAULTS, user, { id: id }),
        url:'gree/delHistoryAddress'
    })
};


//兑换下单
//province      省份
//city          城市
//area          区域
//address       详细地址
//receiveMobile 收件手机
//customerName  收件人名
//uuid          uuid
//skuno         商品编码
//merchantNO    商户编号
//authCode      验证码
//consumeMobile 消费手机
const glExchangeOrder = data => {
    return fetch({
        data,
        url: 'glExchangeOrder'
    });
}

//订单详情
const glExchangOrderDetail = data => {
    return fetch({
        data: data.user,
        url: `${data.merchantNO}/${data.orderNO}/glExchangOrderDetail`
    });
}

//获取动态码
const getDynaic = phone => {
    return fetch({
        url:`${phone}/getDynaic`
    })
}

//获取短信验证码
const getMsgCode = data => {
    return fetch({
        data,
        url: 'getMsgCode'
    });
}

//获取可用积分
const getScores = (data, kySign) => {
    return fetch({
        data,
        url:`${kySign}/getScores`
    })
};

//验证是否可以消费
const isCanUse = data => {
    return fetch({
        data,
        url: "isCanUse"
    });
}


export {
    queryGLGoodsList,
    queryGLGoodsDetail,
    queryAddress,
    addOrUpdateAddress,
    historyAddress,
    setDefaultAddress,
    delHistoryAddress,
    glExchangeOrder,
    glExchangOrderDetail,
    getDynaic,
    getMsgCode,
    getScores,
    isCanUse
};
