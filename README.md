# pic_search

本项目为 [Adachi-BOT][1] 的衍生插件，基于 [SauceNAO][2] 接口实现的qq机器人搜图功能。

## 安装插件

进入 `Adachi-BOT/src/plugins` 目录下，执行如下命令

```bash
git clone https://github.com/MarryDream/pic_search.git
```

或通过本项目仓库左上角 `code -> Download.zip` 下载压缩包，解压至 `Adachi-BOT/src/plugins` 目录内

> 注意：若使用下载压缩包方式，请务必删除解压后目录名字中的 `-master`，否则插件无法启动

## 食用方法

初次运行会在 `Adachi-BOT/config` 目录下创建 `pic_search.yml` 配置文件，初始值如下

```yaml
tip: 搜图插件配置文件，searchKeys必填，可填写多个
multiple: true
searchKeys:
  - searchKeyA
  - searchKeyB
```

- tip: 不用管，删了都行
- multiple: true（多图搜索，上限三张）false（单图搜索），不配置该配置项默认为**单图搜索**
- searchKeys：必填，搜图必备api key，允许添加多个 key，每一个 key 按照格式换行以 ` - ` 开头

修改 `pic_search.yml` 后重启 bot 或执行 Adachi-BOT 的 `refresh` 重载配置文件指令生效

你可以选择自行创建该文件，或先启动一次 bot 自动创建该配置文件后再前去修改，修改后重载配置文件

## 食用示例

使用 `#pic_search` 跟随图片发送，默认允许附带多张图片，最多三张

<div align="center">
    <img src="https://github.com/MarryDream/pic_search/blob/master/doc/multiple_search.png?raw=true" width="250" alt="多图搜索示例" />
    <p style="color: #666; margin: 0">[多图搜索示例]</p>
</div>

> 注：前置符号 # 与指令关键字 pic_search 均可修改，详见 [Adachi-BOT 说明文档][3]  
> 查询到的图片相似度小于 80% 将会直接提示 “未找到类似图片”  
> 查询结果为 pixiv 图片时不会返回链接，链接太多容易被风控 ~~不会有人拿着pixiv_id还找不到图吧~~

## searchKeys获取

前往 [SauceNAO账户页][4] 注册账号

注册成功后在 [api页][5] 即可看到 `api key` 字段，填入 `pic_search.yml` 的 `searchKeys` 字段即可

> 每个 SauceNAO api_key 一天仅支持查询 200 次，若有需求，请配置多个 api_key，依次加入 searchKeys 字段内即可

## 其他说明

SauceNAO api 搜索限制每 30s 仅能搜索 6次，该插件目前并未对此作出切换其他 key 的处理（摸了），后续可能添加此优化。

卑微打工人短时间赶制出来的屑作，不保证没有 bug， 有问题还请提 issue（躺）


[1]: https://github.com/SilveryStar/Adachi-BOT

[2]: https://saucenao.com/

[3]: https://docs.adachi.top/config/#commands-yml

[4]: https://saucenao.com/user.php

[5]: https://saucenao.com/user.php?page=search-api
