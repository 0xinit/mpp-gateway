import { proxy, serviceCount } from "../src/proxy.js"

export const config = { runtime: "edge" }

const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MPP Gateway</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;min-height:100vh;display:flex;flex-direction:column;align-items:center}
  .hero{max-width:720px;width:100%;padding:80px 24px 40px}
  h1{font-size:2.5rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
  h1 span{color:#22c55e}
  .sub{color:#a3a3a3;font-size:1.1rem;margin-bottom:40px;line-height:1.5}
  .stat-row{display:flex;gap:24px;margin-bottom:40px}
  .stat{background:#171717;border:1px solid #262626;border-radius:12px;padding:20px 24px;flex:1;text-align:center}
  .stat .num{font-size:2rem;font-weight:700;color:#22c55e}
  .stat .label{color:#a3a3a3;font-size:0.85rem;margin-top:4px}
  .links{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px}
  .links a{display:inline-block;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:0.9rem;font-weight:500;transition:all 0.15s}
  .links .primary{background:#22c55e;color:#0a0a0a}
  .links .primary:hover{background:#16a34a}
  .links .secondary{background:#171717;color:#e5e5e5;border:1px solid #262626}
  .links .secondary:hover{border-color:#404040}
  .section{margin-bottom:32px;width:100%}
  .section h2{font-size:1.1rem;font-weight:600;margin-bottom:16px;color:#d4d4d4}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
  .chip{background:#171717;border:1px solid #262626;border-radius:8px;padding:12px 16px;font-size:0.85rem}
  .chip .name{font-weight:600;color:#e5e5e5}
  .chip .cat{color:#737373;font-size:0.75rem;margin-top:2px}
  .try{background:#171717;border:1px solid #262626;border-radius:12px;padding:20px 24px;margin-bottom:32px;width:100%}
  .try h3{font-size:0.9rem;font-weight:600;margin-bottom:12px;color:#a3a3a3}
  .try code{display:block;background:#0a0a0a;border:1px solid #262626;border-radius:6px;padding:12px 16px;font-size:0.82rem;color:#22c55e;overflow-x:auto;white-space:pre;font-family:'SF Mono',Consolas,monospace}
  .footer{color:#525252;font-size:0.8rem;padding:40px 24px;text-align:center}
  .footer a{color:#737373;text-decoration:none}
  .badge{display:inline-block;background:#22c55e20;color:#22c55e;font-size:0.75rem;padding:2px 8px;border-radius:4px;font-weight:600;margin-left:8px;vertical-align:middle}
</style>
</head>
<body>
<div class="hero">
  <h1><span>MPP</span> Gateway</h1>
  <p class="sub">43 APIs behind Machine Payments Protocol. Pay with stablecoins, access any API — no API keys needed on the client side.</p>

  <div class="stat-row">
    <div class="stat"><div class="num" id="svc-count">-</div><div class="label">Services Live</div></div>
    <div class="stat"><div class="num">43</div><div class="label">Total Available</div></div>
    <div class="stat"><div class="num">11</div><div class="label">Categories</div></div>
  </div>

  <div class="links">
    <a href="/discover" class="primary">Discover Services</a>
    <a href="/llms.txt" class="secondary">llms.txt</a>
    <a href="/discover/all.md" class="secondary">All Routes</a>
    <a href="https://github.com/0xinit/mpp-gateway" class="secondary">GitHub</a>
  </div>

  <div class="try">
    <h3>Try it</h3>
    <code>tempo request -t -X GET https://mpp-gateway.vercel.app/massive/v1/marketstatus/now</code>
  </div>

  <div class="section">
    <h2>Services</h2>
    <div class="grid" id="svc-grid"></div>
  </div>
</div>
<div class="footer">
  Built for the <a href="https://hackathon.tempo.xyz">MPP Hackathon</a> by Tempo &amp; Stripe
</div>
<script>
fetch('/discover').then(r=>r.json()).then(svcs=>{
  document.getElementById('svc-count').textContent=svcs.length;
  const grid=document.getElementById('svc-grid');
  svcs.forEach(s=>{
    const d=document.createElement('div');d.className='chip';
    d.innerHTML='<div class="name">'+s.title+'</div><div class="cat">'+s.routes.length+' endpoints</div>';
    grid.appendChild(d);
  });
}).catch(()=>{
  document.getElementById('svc-count').textContent='0';
});
</script>
</body>
</html>`

export default function handler(req: Request) {
  const url = new URL(req.url)

  if (url.pathname === "/" || url.pathname === "") {
    const accept = req.headers.get("accept") ?? ""
    const ua = req.headers.get("user-agent") ?? ""
    const wantsBrowser = accept.includes("text/html") && !ua.includes("curl") && !ua.includes("mppx")
    if (wantsBrowser) {
      return new Response(landingHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    }
  }

  return proxy.fetch(req)
}
