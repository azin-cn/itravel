package com.yefeng.monorepo.result;

/**
 * @author 夜枫
 */

public class Result<T> {
    private String message;
    private int retCode;
    private T data;

    private Result(T data) {
        this.retCode = 200;
        this.message = "成功";
        this.data = data;
    }

    private Result(CodeMsg cm) {
        if (cm == null) {
            return;
        }
        this.retCode = cm.getRetCode();
        this.message = cm.getMessage();
    }

    public Result(CodeMsg cm, T data) {
        if (cm == null) {
            return;
        }
        this.retCode = cm.getRetCode();
        this.message = cm.getMessage();
        this.data=data;

    }

    public Result() {

    }

    /**
     * 成功时候的调用
     *
     * @return
     */
    public static <T> Result<T> success(T data) {
        return new Result<T>(data);
    }

    /**
     * 成功，不需要传入参数
     *
     * @return
     */
    @SuppressWarnings("unchecked")
    public static <T> Result<T> success() {
        return (Result<T>) success("");
    }

    /**
     * 失败时候的调用
     *
     * @return
     */
    public static <T> Result<T> error(CodeMsg cm) {
        return new Result<T>(cm);
    }
    public static <T> Result<T> error(String msg) {
        return new Result<T>(new CodeMsg(ResultCode.BUSINESS_ERROR,msg));
    }
    /**
     * 失败时候的调用,扩展消息参数
     *
     * @param cm
     * @param msg
     * @return
     */
    public static <T> Result<T> error(CodeMsg cm, String msg) {
        CodeMsg newCodeMsg = null;
        try {
            newCodeMsg = (CodeMsg) cm.clone();
        } catch (Exception e) {
            e.printStackTrace();
        }
        newCodeMsg.setMessage(cm.getMessage() + "--" + msg);
        return new Result<T>(newCodeMsg);
    }
    public static <T> Result<T> error(CodeMsg cm, T data) {
        CodeMsg newCodeMsg = null;
        try {
            newCodeMsg = (CodeMsg) cm.clone();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new Result<T>(newCodeMsg,data);
    }

    public T getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }

    public int getRetCode() {
        return retCode;
    }


}
