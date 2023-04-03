package com.yefeng.monorepo.aspect;

import cn.hutool.json.JSONConfig;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.yefeng.monorepo.result.ApiResult;
import com.yefeng.monorepo.result.ResultUtil;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.io.StringWriter;

/**
 * @author 夜枫
 */
@Slf4j
@RestControllerAdvice(basePackages = {"com.yefeng.modle_report.controller"})
@Order(11)
public class ResponseControllerAdvice implements ResponseBodyAdvice<Object> {

    /**
     * 判断哪些接口需要进行返回值包装
     * 返回 true 才会执行 beforeBodyWrite 方法；返回 false 则不执行。
     */
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        log.info("判断是否需要进行返回值包装");
        //如果接口方法返回 Result 不需要再次包装
        //如果接口方法使用了 @NotResultWrap 注解，表示不需要包装了
        //只对成功的请求进行返回包装，异常情况统一放在全局异常中进行处理
        return true;
//        return !(returnType.getParameterType().equals(Result.class));
    }
    @Autowired
    ObjectMapper objectMapper;
    /**
     * 进行接口返回值包装
     */
    @Override
    public  Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        log.info("进行返回值包装");
        System.out.println(returnType.getParameterType());
        System.out.println(returnType.getParameterType().getName());
        System.out.println(returnType.getParameterType().getSimpleName());

        if (body instanceof ApiResult){
            return getObject(body);
        }
        if(body instanceof Boolean){
            if(body.equals(true)){
                return ResultUtil.success();
            }else {
                return ResultUtil.failMsg("操作失败，请重试");
            }
        }

        //String 类型不能直接包装，需要进行特殊处理
        if (returnType.getParameterType().equals(String.class)){
//            ObjectMapper objectMapper = new ObjectMapper();
            try {
                //使用 jackson 将返回数据转换为 json
                objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
                return objectMapper.writeValueAsString(ResultUtil.success(body));
            } catch (JsonProcessingException e) {
                //这里会走统一异常处理
                throw new RuntimeException("String类型返回值包装异常");
            }
        }
        return getObject(ResultUtil.success(body));
    }

    @NotNull
    private Object getObject(Object body) {
        try {
            String jsonString = objectMapper.writeValueAsString(body);
            JsonFactory factory = objectMapper.getFactory();
            JsonGenerator generator = factory.createGenerator(new StringWriter());
            generator.writeRawValue(jsonString);
            generator.flush();
            String unescapedJsonString = generator.getOutputTarget().toString();

            JsonNode jsonNode = objectMapper.readTree(unescapedJsonString);
            objectMapper.enable(SerializationFeature.WRITE_NULL_MAP_VALUES);

            JSONConfig jsonConfig = new JSONConfig();
            jsonConfig.setIgnoreNullValue(false);

//            return body;
//            JSONObject jsonObject = JSONUtil.parseObj(generator.getOutputTarget(), false);
            JSONObject jsonObject = JSONUtil.parseObj(unescapedJsonString, true);
            return jsonNode;
//            return jsonObject;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
