import type { IncomingMessage, ServerResponse } from "node:http"
import { proxy } from "../src/proxy.js"

const GATEWAY = "https://mpp-gateway.vercel.app"

const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MPP Gateway</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;min-height:100vh}
  .wrap{max-width:800px;margin:0 auto;padding:80px 24px 40px}
  h1{font-size:2.5rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
  h1 span{color:#22c55e}
  .sub{color:#a3a3a3;font-size:1.1rem;margin-bottom:40px;line-height:1.5}
  .stat-row{display:flex;gap:16px;margin-bottom:40px}
  .stat{background:#171717;border:1px solid #262626;border-radius:12px;padding:20px 24px;flex:1;text-align:center}
  .stat .num{font-size:2rem;font-weight:700;color:#22c55e}
  .stat .label{color:#a3a3a3;font-size:0.85rem;margin-top:4px}
  .links{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px}
  .links a{display:inline-block;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:0.9rem;font-weight:500;transition:all 0.15s}
  .primary{background:#22c55e;color:#0a0a0a}
  .primary:hover{background:#16a34a}
  .secondary{background:#171717;color:#e5e5e5;border:1px solid #262626}
  .secondary:hover{border-color:#404040}
  .section{margin-bottom:40px}
  .section h2{font-size:1.2rem;font-weight:600;margin-bottom:16px;color:#d4d4d4}
  .examples{display:flex;flex-direction:column;gap:12px;margin-bottom:40px}
  .ex{background:#171717;border:1px solid #262626;border-radius:12px;padding:16px 20px}
  .ex .label{font-size:0.8rem;color:#a3a3a3;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
  .ex .label .tag{font-size:0.7rem;padding:2px 8px;border-radius:4px;font-weight:600}
  .tag-free{background:#22c55e20;color:#22c55e}
  .tag-paid{background:#f59e0b20;color:#f59e0b}
  .ex code{display:block;background:#0a0a0a;border:1px solid #262626;border-radius:6px;padding:10px 14px;font-size:0.8rem;color:#22c55e;overflow-x:auto;white-space:pre;font-family:'SF Mono',Consolas,monospace}
  .svc-card{background:#171717;border:1px solid #262626;border-radius:12px;padding:20px;margin-bottom:12px}
  .svc-card h3{font-size:1rem;font-weight:600;margin-bottom:4px}
  .svc-card .desc{font-size:0.85rem;color:#a3a3a3;margin-bottom:12px}
  .svc-card .routes{display:flex;flex-direction:column;gap:6px}
  .route{display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;padding:6px 10px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:6px}
  .route .method{font-weight:700;margin-right:8px;font-family:'SF Mono',Consolas,monospace}
  .route .path{color:#d4d4d4;font-family:'SF Mono',Consolas,monospace;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .route .price{color:#f59e0b;font-weight:600;margin-left:12px;white-space:nowrap}
  .route .price.free{color:#22c55e}
  .method-GET{color:#22c55e}
  .method-POST{color:#3b82f6}
  .method-PUT{color:#f59e0b}
  .method-PATCH{color:#f59e0b}
  .method-DELETE{color:#ef4444}
  .footer{color:#525252;font-size:0.8rem;padding:40px 24px;text-align:center}
  .footer a{color:#737373;text-decoration:none}
  .how{background:#171717;border:1px solid #262626;border-radius:12px;padding:20px;margin-bottom:40px}
  .how h2{font-size:1.1rem;font-weight:600;margin-bottom:12px;color:#d4d4d4}
  .how ol{padding-left:20px;color:#a3a3a3;font-size:0.85rem;line-height:1.8}
  .how code{background:#0a0a0a;padding:2px 6px;border-radius:4px;font-size:0.8rem;color:#22c55e}
</style>
</head>
<body>
<div class="wrap">
  <h1><span>MPP</span> Gateway</h1>
  <p class="sub">43 APIs behind Machine Payments Protocol. Pay with stablecoins, access any API — no API keys needed on the client side.</p>

  <div class="stat-row">
    <div class="stat"><div class="num" id="svc-count">-</div><div class="label">Services Live</div></div>
    <div class="stat"><div class="num" id="route-count">-</div><div class="label">Total Endpoints</div></div>
    <div class="stat"><div class="num">11</div><div class="label">Categories</div></div>
  </div>

  <div class="links">
    <a href="/discover" class="primary">Discover API</a>
    <a href="/llms.txt" class="secondary">llms.txt</a>
    <a href="/discover/all.md" class="secondary">All Routes</a>
    <a href="https://github.com/0xinit/mpp-gateway" class="secondary">GitHub</a>
  </div>

  <div class="how">
    <h2>How it works</h2>
    <ol>
      <li>Request any endpoint &rarr; get <code>402 Payment Required</code></li>
      <li>Client pays via Tempo stablecoin (automatic with <code>tempo</code> CLI)</li>
      <li>Gateway proxies to upstream API &rarr; you get the response + <code>Payment-Receipt</code></li>
    </ol>
  </div>

  <div class="section">
    <h2>Try it</h2>
    <div class="examples">
      <div class="ex">
        <div class="label">Market status (Massive) <span class="tag tag-free">FREE</span></div>
        <code>tempo request -t -X GET ${GATEWAY}/massive/v1/marketstatus/now</code>
      </div>
      <div class="ex">
        <div class="label">Stock lookup (Massive) <span class="tag tag-paid">$0.005</span></div>
        <code>tempo request -t -X GET "${GATEWAY}/massive/v3/reference/tickers?ticker=AAPL"</code>
      </div>
      <div class="ex">
        <div class="label">Check balance (Stripe) <span class="tag tag-paid">$0.005</span></div>
        <code>tempo request -t -X GET ${GATEWAY}/stripe/v1/balance</code>
      </div>
      <div class="ex">
        <div class="label">List repos (GitHub) <span class="tag tag-paid">$0.005</span></div>
        <code>tempo request -t -X GET ${GATEWAY}/github/user/repos</code>
      </div>
      <div class="ex">
        <div class="label">Send SMS (Twilio) <span class="tag tag-paid">$0.01</span></div>
        <code>tempo request -t -X POST --json '{"To":"+1...","From":"+1...","Body":"Hello from MPP"}' ${GATEWAY}/twilio/2010-04-01/Accounts/&lt;SID&gt;/Messages.json</code>
      </div>
      <div class="ex">
        <div class="label">Bank balance (Plaid) <span class="tag tag-paid">$0.01</span></div>
        <code>tempo request -t -X POST --json '{"access_token":"..."}' ${GATEWAY}/plaid/accounts/balance/get</code>
      </div>
      <div class="ex">
        <div class="label">Carbon removal (Stripe Climate) <span class="tag tag-paid">$0.10</span></div>
        <code>tempo request -t -X POST --json '{"metric_tons":"1","currency":"usd"}' ${GATEWAY}/stripe/v1/climate/orders</code>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Services &amp; Endpoints</h2>
    <div id="svc-list"></div>
  </div>
</div>
<div class="footer">
  Built for the <a href="https://hackathon.tempo.xyz">MPP Hackathon</a> by Tempo &amp; Stripe
</div>
<script>
fetch('/discover',{headers:{Accept:'application/json'}}).then(r=>r.json()).then(svcs=>{
  if(!Array.isArray(svcs)) return;
  document.getElementById('svc-count').textContent=svcs.length;
  let totalRoutes=0;
  svcs.forEach(s=>totalRoutes+=(s.routes||[]).length);
  document.getElementById('route-count').textContent=totalRoutes;

  const list=document.getElementById('svc-list');
  svcs.forEach(s=>{
    const card=document.createElement('div');
    card.className='svc-card';
    let routesHtml='';
    (s.routes||[]).forEach(r=>{
      const parts=(r.pattern||r.path||'').split(' ');
      const method=parts.length>1?parts[0]:'GET';
      const path=parts.length>1?parts.slice(1).join(' '):parts[0];
      const p=r.payment;
      let priceStr='FREE';
      let priceClass='free';
      if(p&&p.amount&&p.decimals!==undefined){
        const price=Number(p.amount)/Math.pow(10,Number(p.decimals));
        priceStr='$'+price.toFixed(price<0.01?4:price<0.1?3:2);
        priceClass='';
      }else if(p){
        priceStr='paid';
        priceClass='';
      }
      routesHtml+='<div class="route"><span class="method method-'+method+'">'+method+'</span><span class="path">'+path+'</span><span class="price '+priceClass+'">'+priceStr+'</span></div>';
    });
    card.innerHTML='<h3>'+(s.title||s.id)+'</h3><div class="desc">'+(s.description||'')+'</div><div class="routes">'+routesHtml+'</div>';
    list.appendChild(card);
  });
}).catch(e=>{
  document.getElementById('svc-count').textContent='0';
  document.getElementById('route-count').textContent='0';
});
</script>
</body>
</html>`

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? "/"
  const accept = req.headers.accept ?? ""
  const ua = req.headers["user-agent"] ?? ""

  if ((url === "/" || url === "") && accept.includes("text/html") && !ua.includes("curl") && !ua.includes("mppx")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(landingHtml)
    return
  }

  proxy.listener(req, res)
}
