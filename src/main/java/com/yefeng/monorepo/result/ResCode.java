package com.yefeng.monorepo.result;

/**
 * @author yefeng
 * @version 1.0.0
 * @ClassName ResCode.java
 * @Description TODO
 * @createTime 2022年04月18日 10:06:00
 */
public enum ResCode {
    //    错误码规范
//    统一在一个文件中定义错误码；
//    错误码长度为 5 位；
//    第 1 位表示错误是哪种级别？例如：1 为系统级错误，2 为业务模块错误，可标记 9 种错误级别。
//
//    第 2 位和第 3 位表示错误是哪个模块？例如：01 为用户模块，02 为订单模块，可标记 99 个模块。
//
//    第 4 位和第 5 为表示具体是什么错误？例如：01 为手机号不合法，02 为验证码输入错误，可标记 99 个错误。
    SUCCESS(1, "成功"),
    FAIL(0, "失败"),
    ERROR(-1, "未知错误"),
    PARAM_ERROR(10001, "参数错误"),
    USER_NOT_EXIST(10002, "用户不存在"),
    USER_EXIST(10003, "用户已存在"),
    USER_PASSWORD_ERROR(10004, "用户密码错误"),
    USER_NOT_LOGIN(10005, "用户未登录"),
    USER_NOT_AUTH(10006, "用户未授权"),
    BOOK_NOT_EXIST(20001, "书籍不存在"),
    BOOK_EXIST(20002, "书籍已存在"),
    BOOK_NOT_IN_STOCK(20003, "书籍不在库存"),
    BOOK_NOT_IN_CART(20004, "书籍不在购物车"),
    BOOK_NOT_IN_ORDER(20005, "书籍不在订单"),
    BOOK_NOT_IN_ORDER_DETAIL(20006, "书籍不在订单详情"),
    ORDER_NOT_EXIST(30001, "订单不存在"),
    ORDER_EXIST(30002, "订单已存在"),
    ORDER_NOT_IN_ORDER_DETAIL(30003, "订单不在订单详情"),
    ORDER_DETAIL_NOT_EXIST(30004, "订单详情不存在"),
    ORDER_DETAIL_EXIST(30005, "订单详情已存在"),
    USER_LOGIN_SUCCESS(200, "登录成功"),
    USER_LOGIN_FAIL(202, "登录失败"),
    //未知用户
    USER_UNKNOWN(201, "未知用户"),
    USER_LOGIN_OUT(203, "用户已退出登录"),
    USER_LOGIN_IN(204, "用户未登录"),
    USER_LOGIN_ERROR(205, "用户登录错误"),
    USER_ACCOUNT_LOCKED(206, "账户已锁定"),
    USER_TOO_MANY_ERRORS(207, "用户名或密码错误次数过多"),
    USER_NAME_OR_PASSWORD_ERROR(208, "用户名或密码不正确"),

    USER_REGISTER_FAIL(11, "注册用户失败"),
    USER_PHONE_EXIT(22, "手机号已存在"),
    USER_MAIL_EXIT(23, "邮箱已存在"),
    USER_PERMISSION_BIND_FAIL(274, "绑定权限失败"),
    USER_PERMISSION_UNBIND_FAIL(275, "解绑权限失败"),
    USER_ROLE_BIND_FAIL(276, "绑定角色失败"),
    USER_REGISTER_SUCCESS(277, "用户注册成功"),

    DELETE_USER_SUCCESS(288, "删除用户成功"),

    DELETE_USER_FAIL(289, "删除用户失败"),
    UPDATE_USER_SUCCESS(200, "修改用户信息成功"),
    UPDATE_USER_FAIL(402, "修改用户信息失败"),

    /////////////////用户退出////////////
    USER_LOGOUT_SUCCESS(501, "用户登出成功"),
    USER_LOGOUT_FAIL(502, "用户登出失败"),
    VERIFICATION_CODE_ERROR(603,"验证码错误"),

    USER_EMAIL_FORMAT_ERROR(701,"邮箱格式不正确" ),


    Advertisement_Get_Failed(703,"获取广告失败" ),
    Advertisement_Add_Failed(704   ,"添加广告失败" ),
    Advertisement_Update_Failed(705,"更新广告失败" ),
    Advertisement_Delete_Failed(706,"删除广告失败" ),
    pageSize_Too_Large(707,"分页数量过大，请不用使用爬虫" ),
    ROLE_NOT_EXIST(203,"角色获取失败" ),
    AdvertiseType_Get_Failed(803,"获取广告类型失败" ),
    AdvertiseType_Add_Failed(804,"添加广告类型失败" ),
    AdvertiseType_Delete_Failed(805,"删除广告类型失败" ),
    AdvertiseType_Update_Failed(806,"更新广告类型失败" );


    private Integer errCode;
    private String errMessage;

    ResCode(Integer errCode, String errMessage) {
        this.errCode = errCode;
        this.errMessage = errMessage;
    }

    public Integer getErrCode() {
        return errCode;
    }

    public String getErrMessage() {
        return errMessage;
    }

    public void setErrCode(Integer errCode) {
        this.errCode = errCode;
    }

    public void setErrMessage(String errMessage) {
        this.errMessage = errMessage;
    }


    @Override
    public String toString() {
        return "{" +
                "errCode:" + errCode +
                ", errMessage:\"" + errMessage + '\"' +
                '}';
    }

    public static void main(String[] args) {
        System.out.println(ResCode.SUCCESS);
        System.out.println(ResCode.FAIL);
    }
}
