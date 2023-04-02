package com.yefeng.modle_report.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * This class is for
 *
 * @author 夜枫
 * @version 2023-04-01 17:10
 */
@RestController
@RequestMapping("/base")
public class BaseController {

    @GetMapping("/test")
    public String test(@RequestParam("info") String info){
        return info;
    }
}
