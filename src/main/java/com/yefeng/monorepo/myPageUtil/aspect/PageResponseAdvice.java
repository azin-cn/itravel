package com.yefeng.monorepo.myPageUtil.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yefeng.monorepo.myPageUtil.annotation.Page;
import com.yefeng.monorepo.myPageUtil.annotation.PageHandler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * @author 夜枫
 */
@Slf4j
@Order(9)
@RestControllerAdvice
public class PageResponseAdvice implements ResponseBodyAdvice<Object> {
    /**
     * 判断哪些接口需要进行返回值包装
     * 返回 true 才会执行 beforeBodyWrite 方法；返回 false 则不执行。
     */
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        log.info("判断是否需要进行返回值包装");
        //如果接口方法使用了 @Page 注解，表示需要包装
        //只对成功的请求进行返回包装，异常情况统一放在全局异常中进行处理
        if (AnnotatedElementUtils.hasAnnotation(returnType.getContainingClass(), Page.class)
                || AnnotatedElementUtils.hasAnnotation(returnType.getMethod(), Page.class)) {
            System.out.println("包含 page 注解");
            return true;
        }
        return false;
    }

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    private ApplicationContext context;
    /**
     * 进行接口返回值包装
     */
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {

        Page page = AnnotatedElementUtils.findMergedAnnotation(returnType.getMethod(), Page.class);
        Class<? extends PageHandler> clazz = page.clazz();
        if (clazz == null) {
            return body;
        }
        //判断开启了管理模式
        if (!page.enableManage()) {
            return body;
        }
        try {
            // 获取 PageHandler 实例
            PageHandler pageHandler = context.getBean(clazz);
            // 调用 PageHandler 的 solve 方法进行处理
            return pageHandler.solve(body);
        } catch (Exception e) {
            log.error("处理返回值出错", e);
        }
        return body;
    }

}
