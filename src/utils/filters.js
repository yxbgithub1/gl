export default {
    orderStatus(status) {
        var text;
        switch (status) {
            case 0:
                text = "待发货";
                break;
            case 1:
                text = "待收货";
                break;
            case 2:
                text = "已完成";
                break;
            case 3:
                text = "已关闭";
                break;
            default:
                text = "";
        }
        return text;
    },
    dateFormat(str) {
        var date = new Date(str);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
    },
    checkPhone(phone) { 
        return !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
    },
    shieldPhone(str) { 
        if (!str) return;
        return `${str.slice(0, 3)}****${str.slice(str.length - 4, str.length)}`;
    }
}