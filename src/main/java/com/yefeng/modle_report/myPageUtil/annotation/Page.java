package com.yefeng.modle_report.myPageUtil.annotation;

import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Page {
    boolean enableManage() default true;
    Class<? extends PageHandler<?>> clazz() default DefaultPageHandler.class;
}
