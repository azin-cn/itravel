package com.yefeng.monorepo.generator;


import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * This class is for
 *
 * @author 夜枫
 * @version 2023-01-15 14:40
 */
public class SqlGenerator {
    private String projectPath = System.getProperty("user.dir") + "/";
    private String projectModuleName = "";// 单应用下可不加
    private String author = "yefeng";
    private String parent = "com.yefeng";
    private String partnerModuleName = "monorepo";
    private String sqlUrl = "jdbc:mysql://146.56.116.51:3306/web?serverTimezone=UTC";
    private String sqlUserName = "web";
    private String sqlPassword = "pM0dH4gD6xJ9vN7z";


    public SqlGenerator(String projectPath, String projectModuleName, String author, String parent, String partnerModuleName, String sqlUrl, String sqlUserName, String sqlPassword) {
        this.projectPath = projectPath;
        this.projectModuleName = projectModuleName;
        this.author = author;
        this.parent = parent;
        this.partnerModuleName = partnerModuleName;
        this.sqlUrl = sqlUrl;
        this.sqlUserName = sqlUserName;
        this.sqlPassword = sqlPassword;
    }

    public SqlGenerator() {
    }

    public void generator(String[] sqlTables, String... tablePrefix) {
        generator(Arrays.asList(sqlTables), Arrays.asList(tablePrefix));
    }
    public void generator(List<String> sqlTables, List<String> tablePrefix) {

        FastAutoGenerator.create(sqlUrl, sqlUserName, sqlPassword)
                .globalConfig(builder -> {
                    builder.author(author) // 设置作者
                            .enableSwagger() // 开启 swagger 模式
//                            .fileOverride() // 覆盖已生成文件
                            .outputDir(projectPath + projectModuleName + "/src/main/java"); // 指定输出目录
                })
                .packageConfig(builder -> {
                    builder.parent(parent) // 设置父包名
                            .moduleName(partnerModuleName) // 设置父包模块名
                            .pathInfo(Collections.singletonMap(OutputFile.xml, projectPath + projectModuleName + "/src/main/resources/mapper/")); // 设置mapperXml生成路径
                })
                .strategyConfig(builder -> {
//                    builder.addInclude("sys_config") // 设置需要生成的表名
//                            .addInclude("sys_dict")
//                            .addInclude("sys_log")
//                            .addInclude("sys_menu")
//                            .addInclude("sys_notice")
//                            .addInclude("sys_role_menu")
//                            .addInclude("tb_disk")
//                            .addInclude("tb_disk_file")
//                            .addInclude("tb_file")
//                            .addInclude("tb_follow")
//                            .addInclude("tb_role")
//                            .addInclude("tb_share")
//                            .addInclude("tb_user")
//                            .addInclude("tb_user_role")
//                            .addInclude("user_third_auth")
                    builder
                            .addInclude(sqlTables)
                            .addTablePrefix(tablePrefix);
                })
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }

    public static void main(String[] args) {
         String projectPath = System.getProperty("user.dir") + "/";
//         String projectModuleName = "";// 单应用下可不加
//         String author = "yefeng";
//         String parent = "com.yefeng";
//         String partnerModuleName = "netdisk";
//         String sqlUrl = "jdbc:mysql://127.0.0.1:3306/netdisk?serverTimezone=UTC";
//         String sqlUserName = "root";
//         String sqlPassword = "jiangshao888";

        String projectModuleName = "";// 单应用下可不加
        String author = "yefeng";
        String parent = "com.yefeng";
        String partnerModuleName = "monorepo";
        String sqlUrl = "jdbc:mysql://127.0.0.1:3306/netdisk?serverTimezone=UTC";
        String sqlUserName = "root";
        String sqlPassword = "jiangshao888";


        ArrayList<String> tableLists = new ArrayList<>();
        tableLists.add("article"); // 设置需要生成的表名;
        tableLists.add("article_tags_tag");
        tableLists.add("category");
        tableLists.add("city");
        tableLists.add("comment");
        tableLists.add("country");

        tableLists.add("district");
        tableLists.add("feature");
        tableLists.add("month");
        tableLists.add("province");

        tableLists.add("spot");
        tableLists.add("spot_coordinate");
        tableLists.add("spot_feature");
        tableLists.add("spot_month");
        tableLists.add("tag");
        tableLists.add("title");
        tableLists.add("user");

//        SqlGenerator sqlGenerator = new SqlGenerator(projectPath, projectModuleName, author, parent, partnerModuleName, sqlUrl, sqlUserName, sqlPassword);
        SqlGenerator sqlGenerator = new SqlGenerator();
        ArrayList<String> tb_ = new ArrayList<String>();
//        tb_.add("tb_");
        sqlGenerator.generator(tableLists, tb_);

    }
}
