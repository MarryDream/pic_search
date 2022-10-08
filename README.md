# pic_search

本项目为 [Adachi-BOT][1] 的衍生插件，基于 [SauceNAO][2] 接口实现的qq机器人搜图功能。

## 更新日志
2022.10.08 相关更新
- 支持回复消息方式搜图
- 修复开启at时群聊多余空行

2022.08.03 相关更新
- 适配主项目热更新指令

2022.07.05 相关更新
- 优化因 SauceNAO 服务器故障造成的无返回结果问题

2022.06.13 相关更新
- 新增 `pixiv Fanbox` 相关字段

2022.05.22 相关更新
- 修复玄学触发指令问题

2022.04.20 相关更新
- 修复 atUser 未开启时，群聊消息回复多出一行

2022.04.12 相关更新：
- 移除查询返回数据中的链接
- 丰富查询数据字段
- 修复部分图片查询数据不显示问题
- 添加 **相似度** 配置项

2022.04.11 相关更新：
- 修复 #refresh 无法重载 searchKey 问题
- 添加 @成员 搜索对方头像功能

## 安装插件

进入 `Adachi-BOT/src/plugins` 目录下，执行如下命令

```bash
git clone https://github.com/MarryDream/pic_search.git
```

或通过本项目仓库左上角 `code -> Download.zip` 下载压缩包，解压至 `Adachi-BOT/src/plugins` 目录内

> 注意：若使用下载压缩包方式，请务必删除解压后目录名字中的 `-master`，否则插件无法启动

## 更新方法

进入 `Adachi-BOT/src/plugins/pic_search` 目录下，执行以下命令即可

```bash
git pull
```

当然你也可以直接 下载本项目压缩包 整包替换。

## 食用方法

初次运行会在 `Adachi-BOT/config` 目录下创建 `pic_search.yml` 配置文件，初始值如下

```yaml
tip: 搜图插件配置文件，searchKeys必填，可填写多个
at: true
multiple: true
similarity: 70
searchKeys:
  - searchKeyA
  - searchKeyB
```

- tip: 不用管，删了都行
- at: 是否开启 @用户 查询目标头像功能
- multiple: true（多图搜索，上限三张）false（单图搜索）
- similarity: 相似度，低于该值的结果将不会显示（注意：请不要将该值设置过低，否则结果将会非常不准确）
- searchKeys：必填，搜图必备api key，允许添加多个 key，每一个 key 按照格式换行以 ` - ` 开头

修改 `pic_search.yml` 后重启 bot 或执行 Adachi-BOT 的 `refresh` 重载配置文件指令生效

你可以选择自行创建该文件，或先启动一次 bot 自动创建该配置文件后再前去修改，修改后重载配置文件

## 食用示例

使用 `#pic_search` 跟随 **图片** 或 **@用户(将会把目标头像当作待搜索图片)** 或**回复包含图片的消息** 发送，默认允许附带多张图片，最多三张

<div align="center">
    <img src="https://github.com/MarryDream/pic_search/blob/master/doc/multiple_search.png?raw=true" width="250" alt="多图搜索示例" />
    <br />
    <font color="#666">[多图搜索示例]</font>
</div>
<br />
<div align="center">
    <img src="https://github.com/MarryDream/pic_search/blob/master/doc/reply_search.png?raw=true" width="250" alt="回复搜索示例" />
    <br />
    <font color="#666">[回复搜索示例]</font>
</div>
<br />
<div align="center">
    <img src="https://github.com/MarryDream/pic_search/blob/master/doc/at_search.png?raw=true" width="250" alt="@搜索头像示例" /> 
    <br />
    <font color="#666">[@搜索头像示例]</font>
</div>
~~头像大都是被裁剪过的，大部分能搜到才怪，纯数没锤子用的功能，看个乐呵就好~~

> 注：前置符号 # 与指令关键字 pic_search 均可修改，详见 [Adachi-BOT 说明文档][3]  
> 查询到的图片相似度小于 similarity设定值 将会直接提示 “未找到类似图片”

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
