把任意需要直接通过 URL 下载的静态文件放在此目录。

路径规则：

- 本地开发时：http://localhost:3000/downloads/<filename>
- 部署后：https://<你的域名>/downloads/<filename>

建议与注意事项：

- 小文件测试：直接放在 `public/downloads/` 即可。
- 大文件或需要高带宽、稳定下载：请使用对象存储（如 AWS S3、阿里云 OSS）并配合 CDN。
- 不要在 public 中放置敏感私密文件，public 目录下的文件都会被公开访问。
