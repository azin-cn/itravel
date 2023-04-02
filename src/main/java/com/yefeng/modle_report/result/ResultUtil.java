package com.yefeng.modle_report.result;

/**
 * 返回结果工具类
 * @author 夜枫
 */
public class ResultUtil {

	/**
     * 请求成功
     * @return
     */
    public static <T> ApiResult<T> success() {
        return new ApiResult<T>(HttpCodeEnum.OK.getCode(),HttpCodeEnum.OK.getMessage());
    }

    /**
     * 请求成功（无消息）
     * @return
     */
    public static <T> ApiResult<T> successAndNoMsg() {
        return new ApiResult<T>(HttpCodeEnum.OK.getCode(),"");
    }

    /**
     * 成功请求
     *
     * @param data
     * @return
     */
    public static <T>  ApiResult<T>  success(T data) {
        return new ApiResult<T>(HttpCodeEnum.OK.getCode(), HttpCodeEnum.OK.getMessage() , data);
    }

    /**
     * 成功请求（无消息）
     *
     * @param data
     * @return
     */
    public static <T>  ApiResult<T> successAndNoMsg(T data) {
        return new ApiResult<T>(HttpCodeEnum.OK.getCode(), "", data);
    }

    /**
     * 操作失败
     * @return
     */
    public static <T> ApiResult<T> fail() {
        return new ApiResult<T>(HttpCodeEnum.FAIL.getCode(), HttpCodeEnum.FAIL.getMessage());
    }
    public static <T> ApiResult<T> failMsg(String msg) {
        return new ApiResult<T>(HttpCodeEnum.FAIL.getCode(), msg);
    }
    /**
     * 操作失败
     * @return
     */
    public static <T> ApiResult<T> fail(T data) {
        return new ApiResult<T>(HttpCodeEnum.FAIL.getCode(), HttpCodeEnum.FAIL.getMessage() ,data);
    }
    
    /**
     * 服务器错误
     * @return
     */
    public static <T> ApiResult<T> error() {
        return new ApiResult<T>(HttpCodeEnum.INTERNAL_SERVER_ERROR.getCode(),HttpCodeEnum.INTERNAL_SERVER_ERROR.getMessage());
    }


    /**
     * 服务器错误
     * @param data
     * @return
     */
    public static <T> ApiResult<T> error(T data) {
        return new ApiResult<T>(HttpCodeEnum.INTERNAL_SERVER_ERROR.getCode(),HttpCodeEnum.INTERNAL_SERVER_ERROR.getMessage(), data);
    }
    /**
     * 参数错误
     * @return
     */
    public static <T> ApiResult<T> paramError() {
        return new ApiResult<T>(HttpCodeEnum.INVALID_REQUEST.getCode(), HttpCodeEnum.INVALID_REQUEST.getMessage());
    }

    /**
     * 参数错误
     * @param data
     * @return
     */
    public static <T> ApiResult<T> paramError(T data) {
        return new ApiResult<T>(HttpCodeEnum.INVALID_REQUEST.getCode(), HttpCodeEnum.INVALID_REQUEST.getMessage(), data);
    }

    /**
     * 认证到期
     * @return
     */
    public static <T> ApiResult<T> authExpired() {
        return new ApiResult<T>(HttpCodeEnum.AUTH_EXPIRED.getCode(), HttpCodeEnum.AUTH_EXPIRED.getMessage());
    }

    /**
     * 没有权限
     * @return
     */
    public static <T> ApiResult<T> unAuthorized() {
        return new ApiResult<T>(HttpCodeEnum.UNAUTHORIZED.getCode(), HttpCodeEnum.UNAUTHORIZED.getMessage());
    }

    /**
     * 没有权限
     * @param data
     * @return
     */
    public static <T> ApiResult<T> unAuthorized(T data) {
        return new ApiResult<T>(HttpCodeEnum.UNAUTHORIZED.getCode(),HttpCodeEnum.UNAUTHORIZED.getMessage(),data);
    }


    /**
     *  禁止访问
     * @return
     */
    public static <T> ApiResult<T> forbidden() {
        return new ApiResult<T>(HttpCodeEnum.FORBIDDEN.getCode(),HttpCodeEnum.FORBIDDEN.getMessage());
    }

    /**
     * 禁止访问
     * @param data
     * @return
     */
    public static <T> ApiResult<T> forbidden(T data) {
        return new ApiResult<T>(HttpCodeEnum.FORBIDDEN.getCode(),HttpCodeEnum.FORBIDDEN.getMessage(), data);
    }


    /**
     * 资源不存在
     * @return
     */
    public static <T> ApiResult<T> notFound() {
        return new ApiResult<T>(HttpCodeEnum.NOT_FOUND.getCode(),HttpCodeEnum.NOT_FOUND.getMessage());
    }


    /**
     * 资源不存在
     * @param data
     * @return
     */
    public static <T> ApiResult<T> notFound(T data) {
        return new ApiResult<T>(HttpCodeEnum.NOT_FOUND.getCode(),HttpCodeEnum.NOT_FOUND.getMessage(), data);
    }


    /**
     * 请求的格式不正确
     * @return
     */
    public static <T> ApiResult<T> notAcceptable() {
        return new ApiResult<T>(HttpCodeEnum.NOT_ACCEPTABLE.getCode(),HttpCodeEnum.NOT_ACCEPTABLE.getMessage());
    }


    /**
     * 请求的格式不正确
     * @param data
     * @return
     */
    public static <T> ApiResult<T> notAcceptable(T data) {
        return new ApiResult<T>(HttpCodeEnum.NOT_ACCEPTABLE.getCode(),HttpCodeEnum.NOT_ACCEPTABLE.getMessage(), data);
    }


    /**
     * 数据已经被删除
     * @return
     */
    public static <T> ApiResult<T> gone() {
        return new ApiResult<T>(HttpCodeEnum.GONE.getCode(),HttpCodeEnum.GONE.getMessage());
    }


    /**
     * 数据已经被删除
     * @param data
     * @return
     */
    public static <T> ApiResult<T> gone(T data) {
        return new ApiResult<T>(HttpCodeEnum.GONE.getCode(),HttpCodeEnum.GONE.getMessage(), data);
    }

    /**
     * 实体参数校验错误
     * @return
     */
    public static <T> ApiResult<T> unprocesableEntity() {
        return new ApiResult<T>(HttpCodeEnum.UNPROCESABLE_ENTITY.getCode(),HttpCodeEnum.UNPROCESABLE_ENTITY.getMessage());
    }

    /**
     * 实体参数校验错误
     * @param data
     * @return
     */
    public static <T> ApiResult<T> unprocesableEntity(T data) {
        return new ApiResult<T>(HttpCodeEnum.UNPROCESABLE_ENTITY.getCode(),HttpCodeEnum.UNPROCESABLE_ENTITY.getMessage(), data);
    }

    /**
     * 未知错误
     * @return
     */
    public static <T> ApiResult<T> unKnowError() {
        return new ApiResult<T>(HttpCodeEnum.UN_KNOW_ERROR.getCode(),HttpCodeEnum.UN_KNOW_ERROR.getMessage());
    }

    /**
     * 未知错误
     * @param data
     * @return
     */
    public static <T> ApiResult<T> unKnowError(T data) {
        return new ApiResult<T>(HttpCodeEnum.UN_KNOW_ERROR.getCode(),HttpCodeEnum.UN_KNOW_ERROR.getMessage(), data);
    }

    /**
     * 业务逻辑验证未通过
     * @return
     */
    public static <T> ApiResult<T> verificationFailed() {
        return new ApiResult<T>(HttpCodeEnum.VERIFICATION_FAILED.getCode(),HttpCodeEnum.VERIFICATION_FAILED.getMessage());
    }

    /**
     * 业务逻辑验证未通过
     * @param data
     * @return
     */
    public static <T> ApiResult<T> verificationFailed(T data) {
        return new ApiResult<T>(HttpCodeEnum.VERIFICATION_FAILED.getCode(),HttpCodeEnum.VERIFICATION_FAILED.getMessage(), data);
    }

    /**
     * 自定义返回
     * @param e
     * @return
     */
    public static <T> ApiResult<T> custom(HttpCodeEnum e) {
        return new ApiResult<T>(e.getCode(),e.getMessage());
    }
    /**
     * 自定义返回
     * @param error
     * @return
     */
    public static <T> ApiResult<T> custom(int code, String error) {
        return new ApiResult<T>(code,error);
    }

    /**
     * 自定义返回
     * @param error
     * @param data
     * @return
     */
    public static <T> ApiResult<T> custom(int code, String error, T data) {
        return new ApiResult<T>(code,error,data);
    }

}
