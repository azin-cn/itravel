package com.yefeng.monorepo.exception;

/**
 * This class is for
 *
 * @author 夜枫
 * @version 2023-01-14 14:23
 */
public class TokenException extends RuntimeException {

    private static final long serialVersionUID =232342233234L;

    private String msg;
    private int code = 403;
    public TokenException(String msg) {
        super(msg);
        this.msg = msg;
    }

    public TokenException(String msg, Throwable e) {
        super(msg, e);
        this.msg = msg;
    }

    public TokenException(String msg, int code) {
        super(msg);
        this.msg = msg;
        this.code = code;
    }

    public TokenException(String msg, int code, Throwable e) {
        super(msg, e);
        this.msg = msg;
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }



}
