const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// 你的固定参数
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || "liwei95.a.d.0.2.1.4.2.0.0.0.7.4.0.1.0.0.2.ip6.arpa";
const CFIP = process.env.CFIP || "cdns.doon.eu.org";
const CFPORT = Number(process.env.CFPORT) || 443;
const NAME = process.env.NAME || "liwei";

// UUID 随便用你以前那一个
const UUID = process.env.UUID || "82fdeaf5-377b-4c94-ae12-3312051a12b4";

// VLESS 节点
function buildVless() {
  return `vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${ARGO_DOMAIN}&fp=random&type=ws&host=${ARGO_DOMAIN}&path=%2F%3Fed%3D2560#${NAME}-VLESS`;
}

// VMess 节点
function buildVmess() {
  const config = {
    v: "2",
    ps: `${NAME}-VMess`,
    add: CFIP,
    port: String(CFPORT),
    id: UUID,
    aid: "0",
    scy: "none",
    net: "ws",
    type: "none",
    host: ARGO_DOMAIN,
    path: "/?ed=2560",
    tls: "tls",
    sni: ARGO_DOMAIN,
    alpn: ""
  };

  const json = JSON.stringify(config);
  const b64 = Buffer.from(json).toString("base64");
  return `vmess://${b64}`;
}

// Trojan 节点（密码直接用 UUID）
function buildTrojan() {
  return `trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${ARGO_DOMAIN}&type=ws&host=${ARGO_DOMAIN}&path=%2F%3Fed%3D2560#${NAME}-Trojan`;
}

// 订阅地址：/sub  输出 base64
app.get("/sub", (req, res) => {
  const lines = [buildVless(), buildVmess(), buildTrojan()].join("\n");
  const b64 = Buffer.from(lines, "utf-8").toString("base64");
  res.type("text/plain").send(b64);
});

// 根路径简单提示一下
app.get("/", (req, res) => {
  res.send("OK - use /sub to get subscription.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
