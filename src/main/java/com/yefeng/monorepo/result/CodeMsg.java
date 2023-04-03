package com.yefeng.monorepo.result;

/**
 * @author 夜枫
 */
public class CodeMsg implements Cloneable {
    private int retCode;
    private String message;

    // 通用异常
    public static CodeMsg SUCCESS = new CodeMsg(0, "success");
    public static CodeMsg EMPTY_PARAM_ERROR = new CodeMsg(400, "参数为空");
    public static CodeMsg INTER_ERROR = new CodeMsg(505, "服务端异常");

    public CodeMsg(int retCode, String message) {
        this.retCode = retCode;
        this.message = message;
    }

    public int getRetCode() {
        return retCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return (CodeMsg) super.clone();
    }
}
