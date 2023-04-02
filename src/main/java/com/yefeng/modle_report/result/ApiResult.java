package com.yefeng.modle_report.result;

import java.io.Serializable;


/**
 * 操作结果集封装
 * @author zealon
 */
//@JsonInclude(value = JsonInclude.Include.NON_EMPTY)

public class ApiResult<T>  implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer errCode;
    private String errMsg;
    private T data;

    public ApiResult(int errCode, String errMsg, T data) {
        this.errCode = errCode;
        this.errMsg = errMsg;
        this.data = data;
    }
    public ApiResult(int errCode, String errMsg) {
        this.errCode = errCode;
        this.errMsg = errMsg;
    }

    public ApiResult() {

    }

    public ApiResult(T data) {
        this.data = data;
        this.errCode =HttpCodeEnum.OK.getCode();
        this.errMsg =HttpCodeEnum.OK.getMessage();
    }
    public ApiResult(HttpCodeEnum codeEnum,T data) {
        this.errCode =codeEnum.getCode();
        this.errMsg =codeEnum.getMessage();
        this.data = data;
    }
    public ApiResult(HttpCodeEnum codeEnum) {
        this.errCode =codeEnum.getCode();
        this.errMsg =codeEnum.getMessage();

    }


    /**
     * 得到json字符串
     *
     * @return {@link String}
     */
    private String getJsonString() {
        String res = "{";
        if (errCode != null) {
            res += "\"errCode\":" + errCode;
        }
        if (errMsg != null) {
            res += ",\"errMsg\":\"" + errMsg + "\"";
        }
        if (data != null) {
            res += ",\"data\":" + data;
        }
        res += "}";
        return res;
    }
//    public JSONObject toJsonObject() {
//        JSONObject jsonObject = JSONUtil.parseObj(getJsonString());
//
//        return jsonObject;
//    }
//    @Override
//    public String toString() {
//
//        return getJsonString();
//    }
    /**
     * 构建消息内容
     * @param msg
     * @return
     */
    public ApiResult buildMessage(String msg){
        this.setErrMsg(msg);
        return this;
    }

    /**
     * 构建消息data的值，key默认为data
     * @param obj data值
     * @return
     */
    public ApiResult buildData(T obj){
        this.setData(obj);
        return this;

    }

    public int getErrCode() {
        return errCode;
    }

    public ApiResult setErrCode(int errCode) {
        this.errCode = errCode;
        return this;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public ApiResult setErrMsg(String errMsg) {
        this.errMsg = errMsg;
        return this;
    }

    public T getData() {
        return data;
    }

    public ApiResult setData(T data) {
        this.data = data;
        return this;
    }
}
