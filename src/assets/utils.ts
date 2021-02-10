/**
 * 根据 ua 判断设备类型信息
 * @param {*} u ua
 */
export const checkVersionByUA = (u: string) => {
  let info = null
  if (!info) {
    info = {
      // 移动终端浏览器版本信息
      trident: /Trident/i.test(u), // IE内核
      presto: /Presto/i.test(u), // opera内核
      webKit: /AppleWebKit/i.test(u), // 苹果、谷歌内核
      gecko: /Gecko/i.test(u) && !/KHTML/i.test(u), // 火狐内核
      mobile: /AppleWebKit.*Mobile.*/i.test(u), // 是否为移动终端
      ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(u), // ios终端
      android: /Android/i.test(u) || /Linux/i.test(u), // android终端或者uc浏览器
      windowsphone: /Windows Phone/i.test(u), // Windows Phone
      iPhone: /iPhone/i.test(u), // 是否为iPhone或者QQHD浏览器
      iPad: /iPad/i.test(u), // 是否iPad
      MicroMessenger: /MicroMessenger/i.test(u), // 是否为微信
      webApp: !/Safari/i.test(u), // 是否web应该程序，没有头部与底部
      edge: /edge/i.test(u),
      weibo: /Weibo/i.test(u),
      uc: /UCBrowser/i.test(u),
      qq: /MQQBrowser/i.test(u),
      baidu: /Baidu/i.test(u),
    }
  }
  return info
}