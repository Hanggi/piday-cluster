if(!self.define){let s,e={};const i=(i,a)=>(i=new URL(i+".js",a).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(a,c)=>{const t=s||("document"in self?document.currentScript.src:"")||location.href;if(e[t])return;let n={};const r=s=>i(s,t),o={module:{uri:t},exports:n,require:r};e[t]=Promise.all(a.map((s=>o[s]||r(s)))).then((s=>(c(...s),n)))}}define(["./workbox-4754cb34"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"42463aa9faaf4bef0a723a53984ed7d6"},{url:"/_next/static/chunks/05f6971a.ca11e346d691aa7b.js",revision:"ca11e346d691aa7b"},{url:"/_next/static/chunks/1101-61a5c07e949ac42c.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/1143-6cf24ecac2e51acd.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/1153-295609d0ec48ef60.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/1351.ff32eda272196e57.js",revision:"ff32eda272196e57"},{url:"/_next/static/chunks/1371.f0cf4093fd770642.js",revision:"f0cf4093fd770642"},{url:"/_next/static/chunks/151-1086c99136b170ca.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/1517-57f8576ee8b9ba8f.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/1978.ea3c541ddf427ced.js",revision:"ea3c541ddf427ced"},{url:"/_next/static/chunks/2138.90d381f76c879d55.js",revision:"90d381f76c879d55"},{url:"/_next/static/chunks/2198-0c8c5bb5f8c9cd9f.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/2255-69e2ae6314e2d46b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/2375-7aaccd3689fb5a65.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/2415.3c7cc44329feec10.js",revision:"3c7cc44329feec10"},{url:"/_next/static/chunks/2442-eeb720d48e5fc67a.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/2526-4137913241e5a1b2.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/2530.5c59f855e940dcd0.js",revision:"5c59f855e940dcd0"},{url:"/_next/static/chunks/2746-8b215e2dfacda731.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/2955.963637f4630c2416.js",revision:"963637f4630c2416"},{url:"/_next/static/chunks/3154-9e6c669d376e691d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/3182-bfc5b27957e25e03.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/3269-123d828a121ccf26.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/3356.da2808a98c93f7c2.js",revision:"da2808a98c93f7c2"},{url:"/_next/static/chunks/3388.e19792937ceed0a4.js",revision:"e19792937ceed0a4"},{url:"/_next/static/chunks/3526.f9f38f97abb1b77e.js",revision:"f9f38f97abb1b77e"},{url:"/_next/static/chunks/3854-90fb4fdc27ac870d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/4007-1475007a7ad614f1.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/4046-d84324767c198a30.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/408.82bc9d125075d043.js",revision:"82bc9d125075d043"},{url:"/_next/static/chunks/441.ae63cd7f408e91d2.js",revision:"ae63cd7f408e91d2"},{url:"/_next/static/chunks/4635-3816cdfb41b8a87c.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/467.d63b4d5c3d239ba5.js",revision:"d63b4d5c3d239ba5"},{url:"/_next/static/chunks/4892.2114dfbb2b5f5e20.js",revision:"2114dfbb2b5f5e20"},{url:"/_next/static/chunks/498-b3da0e132654a6dc.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/4bd1b696-1cfe8d0db367fd56.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/5203.760bbd2e5f7bb44a.js",revision:"760bbd2e5f7bb44a"},{url:"/_next/static/chunks/5440-fd8dc0d045e96036.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/5472.095a61fdd3d4c7d9.js",revision:"095a61fdd3d4c7d9"},{url:"/_next/static/chunks/5571-7a83247b1de13641.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/5615-3f233b842365b515.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/5644-dedbd0438051f93f.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/571.2783f158121b1065.js",revision:"2783f158121b1065"},{url:"/_next/static/chunks/614-d8f819b451d7ea4d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/6218.0f0e55da67a60fee.js",revision:"0f0e55da67a60fee"},{url:"/_next/static/chunks/6345-f2a5d654923f4696.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/6615-5bf3f3ab24336fed.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/6763.808690ba1a7963da.js",revision:"808690ba1a7963da"},{url:"/_next/static/chunks/694.7e155da675996abb.js",revision:"7e155da675996abb"},{url:"/_next/static/chunks/6947-d39523b7528635d6.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/7144-933ce28ea10ad982.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/7173-cc0bae0fe1e16c6b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/7373.70285f7f162a47e5.js",revision:"70285f7f162a47e5"},{url:"/_next/static/chunks/7374-e77949d1672a04e8.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/7417-4d619b0f23bb44ab.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/749-15b443ae646b454f.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/7778-5865e55799fb3613.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/7970-1398946ca9361faf.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/8016-9b2f8dbc0914aed2.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/8173-a50e406efb589446.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/8351-39fa479b535e2d0b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/847-02a20f66742c07e7.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/8820.727ea1ae79ab6850.js",revision:"727ea1ae79ab6850"},{url:"/_next/static/chunks/8960-6387480bb276f465.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/8ffc485e-4980d72f93c603d4.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/9071.a8d4559c53c9ceb9.js",revision:"a8d4559c53c9ceb9"},{url:"/_next/static/chunks/921-a729144a659ce608.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/9396-8f56cd417f5a2846.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/9732-6dab8c570f10e34d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/9741.e919d38285d2c9ac.js",revision:"e919d38285d2c9ac"},{url:"/_next/static/chunks/9795-0fcef2df45a2e1f4.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/9808-09f067b1e58eb8db.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/(my)/layout-8863a044bbd68a73.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/(my)/my/assets/page-5f16f8fa59795394.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/(my)/my/balance/page-87f4936fd30bc5eb.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/(my)/my/settings/page-5838060242627a63.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/(my)/profile/leaderboard/page-b128b93a7146c9ee.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/(my)/profile/page-6adbd18fb463111b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/about/page-29b2ea2dd09fa369.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/auth/reset-password/page-9f1092688d451909.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/auth/reset-payment-password/page-2512e94048e5e23b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/blog/%5Bdate%5D/%5Bslug%5D/page-ddeb766fd197539d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/blog/page-e947e0b8c418c067.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/layout-8d67918212f22b7d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/market/page-d4306a5f60aec8a5.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/mining/page-c26d342c1f9a61ba.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/page-750dc105156a8b2b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/privacy-policy/page-f8dea2c4b5728f38.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/ranking/page-f735845e226641c3.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/search/page-a21028c2c21920a4.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/test/dev/page-5296606f3c2ff0cf.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/test/page-cba442242f9f2473.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/%5Blocale%5D/ve/%5BdecimalID%5D/page-9a3295af0de1de44.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/_not-found/page-129f3890e7ca08c2.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/%5B...all%5D/route-6b51cc295eaf6980.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/account/%5B...all%5D/route-eb61b2073d490550.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/account/balance/records/route-c8819d0f12cd9f29.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/account/balance/route-5deae03a9b5ac8b9.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/account/balance/transfer2/route-74f7e79cb5508490.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/account/pi-address/route-100fb7f43ca60cfd.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/admin/%5B...adminroute%5D/route-ffc1fd755a2d0fe4.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-bf6b4084d36099cf.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/logout/route-7698e8fbdc732eb1.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/payment-password/route-e54fc9af160c4452.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/pi-sign-in/route-d4a29b7eee310b76.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/register/route-5111619c60e16211.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/reset-password/route-da5263f8b4b782cc.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/reset-payment-password/route-d84b09847017cf23.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/send-email-verification/route-9310c5a06cf0a12a.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/send-password-reset-email/route-b2fa95d5604ec802.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/auth/send-payment-password-reset-email/route-ec033507e831ea89.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/leaderboard/commission-rank/route-46635be784abf95d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/leaderboard/invitation-rank/route-e0f53a263116e87e.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/leaderboard/points-rank/route-c80f5845229f3e80.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/map/places/route-c3cf461c2f732140.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/point/%5B...all%5D/route-bd5b371166441ff2.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/user/get-invite-code/route-05eb29b2fe87f81e.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/user/info/route-88c10fa9b0ed003e.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/user/route-1eaf0ae3db7de262.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/user/update-nationality/route-fb8140c82f83a481.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estate-listing/%5BhexID%5D/bid/route-1cafb9ac8157fae0.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estate-listing/cancel/%5BlistingID%5D/route-47a6886550791ef6.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5B...all%5D/route-1b58e7a6b6a56b11.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/ask/%5BaskID%5D/accept/route-d79e1cab934db742.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/bid/%5BbidID%5D/accept/route-70f23ece55a4482f.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/cluster/route-a1d3be49fa2baae1.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/in-area/route-5981ea9fe5b6a06a.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/listing/route-73b812191aa7a3a9.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/route-378e90979ebd206a.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/transactions/route-7fd3cacc42bd7b64.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/%5BhexID%5D/transfer/route-b01f464227c7c5fb.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/all/route-6f0f1b1ce1b40d11.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/listed/route-2b3914cad6f3c76e.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/search/route-17025e03b1748669.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/statistics/route-f4a54c90eb9051fa.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/virtual-estates/transaction/route-d129fb9430be6b0b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/withdraw/cancel/route-8eb1dc77ef8e79e1.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/api/withdraw/create/route-186c076c14f8bc21.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/layout-fe6cb4bedc269d26.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/page-7d3ae9fd6a6146c2.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/transactions/page-a547cb6a68fc7d66.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/users/balance/records/%5BuserID%5D/page-5a3cd6742290437b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/users/page-5a6216129cd0abca.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/virtual-estates/page-dc582f3758480f52.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/app/manage/withdraw-requests/page-36d74b54052ece72.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/b9391d9f-cea2cb77ff42d352.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/c36f3faa.69fd287b38bd7c5e.js",revision:"69fd287b38bd7c5e"},{url:"/_next/static/chunks/framework-c8065bab8b311d0e.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/main-33b8f48a55757cfb.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/main-app-b2391f6e2b673e8d.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/pages/_app-080ab8c95e4b394e.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/pages/_error-8fb6a0c51df09a96.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-dbe81d7653d4ad4b.js",revision:"vMfSWQZ_1moSbisEbsv7E"},{url:"/_next/static/css/2dbd4aea5798c6ed.css",revision:"2dbd4aea5798c6ed"},{url:"/_next/static/css/5a9e330298082133.css",revision:"5a9e330298082133"},{url:"/_next/static/css/718ee59ff2172a97.css",revision:"718ee59ff2172a97"},{url:"/_next/static/css/93bc9bbad1f40330.css",revision:"93bc9bbad1f40330"},{url:"/_next/static/css/a715cad65123a746.css",revision:"a715cad65123a746"},{url:"/_next/static/css/b3cbcd051438d1d5.css",revision:"b3cbcd051438d1d5"},{url:"/_next/static/css/ce178d2b3058a5fe.css",revision:"ce178d2b3058a5fe"},{url:"/_next/static/media/1a142ec2652f2d06.woff2",revision:"be388d4ee0f6f0e3c704c90545794e2d"},{url:"/_next/static/media/2053df8159b25386.woff2",revision:"89a487243655b1945e8b173e3632e315"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/26a46d62cd723877.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/55c55f0601d81cf3.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/581909926a08bbc8.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/64ea2a5aaa4dedd3.woff2",revision:"9b04ab384e20d8caa6e96f623bdd9a23"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/6d93bde91c0c2823.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/891487401855818d.woff2",revision:"c39f8c869c3ce6e1cecf63da09b0c4f4"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/97e0cb1ae144a2a9.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/9d9b9cae20d87d18.woff2",revision:"5fd8c4e4408334cab1a4eb5280e70ff1"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/a34f9d1faa5f3315.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/b63e4df112f8dce1.woff2",revision:"bfd216fcfe1902b6c614806673a86381"},{url:"/_next/static/media/dba81c1208da12ee.p.woff2",revision:"61ad024295cbcb211b4fda1d44905bf9"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/df0a9ae256c0569c.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/remixicon.19fdd00d.woff",revision:"19fdd00d"},{url:"/_next/static/media/remixicon.72421f8a.eot",revision:"72421f8a"},{url:"/_next/static/media/remixicon.f41ead06.ttf",revision:"f41ead06"},{url:"/_next/static/media/remixicon.ff3db2f0.woff2",revision:"ff3db2f0"},{url:"/_next/static/vMfSWQZ_1moSbisEbsv7E/_buildManifest.js",revision:"cc013a41c3e6784510e055af6a852724"},{url:"/_next/static/vMfSWQZ_1moSbisEbsv7E/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android-chrome-192x192.png",revision:"aa7f45e0c51744c16e4ce0fb79cf2b5d"},{url:"/android-chrome-512x512.png",revision:"01cec7c09f3905862ae8a86913e95ba2"},{url:"/apple-touch-icon.png",revision:"cb8fd15e020ee4f5f650ecf09eb9a5da"},{url:"/bgm/summer.mp3",revision:"19d295c20994fb8dbc52a95210c440f9"},{url:"/blog-images/piday-land/piday-land-1.png",revision:"ca58a59a782747f3ad84fa0ed6879e42"},{url:"/blog-images/piday-land/piday-land-2.png",revision:"eeff493aaa957f03578184299bff8203"},{url:"/blog-images/piday-land/piday-land-3.png",revision:"d142418e00f1b172365dc4448f71b7b1"},{url:"/blog-images/piday-land/piday-land-4.png",revision:"7a823a59d05c3f0fd460104ab400a16b"},{url:"/blog-images/piday-land/piday-land-5.png",revision:"87f69d1ace9b9cdf8c4e6cd69481100f"},{url:"/blog-images/piday-land/piday-land-6.png",revision:"644aa55a5754ceeb1071b7633dbf9d7b"},{url:"/blogs.json",revision:"7b776b46915df2f463f9c8e1f1479a83"},{url:"/blogs/FAQ.md",revision:"8b9a472e9ab1e74e00d237c837ed62c9"},{url:"/blogs/piday-land.md",revision:"24b0ca324ee22ba524ce19a8b46d4d16"},{url:"/favicon-16x16.png",revision:"6a0e7bb2187978b90fcb1db6c397af3e"},{url:"/favicon-32x32.png",revision:"481a80ac033022428cfaa367c129ed40"},{url:"/favicon.ico",revision:"95b37b34e88234cd0601e9df3516741c"},{url:"/images/pi-coin.png",revision:"04f3beda9ebd85295b44eb1f6ae59914"},{url:"/img/about/banner.png",revision:"36f0b18d0262111ee69a3091dca9e14b"},{url:"/img/about/map.png",revision:"e4b3492c7ced9b1b596bab77e73c9f63"},{url:"/img/background/honeycomb.svg",revision:"54efb0fe26c657493ac34ed47d352615"},{url:"/img/banner.png",revision:"6b92d80d05dfd91615486a4ecaf2cbe2"},{url:"/img/icons/Medal.png",revision:"634a22216197e960f3dd69d1e15350dd"},{url:"/img/icons/User.png",revision:"b7c051eb6b674ceb57f4f71fc7611309"},{url:"/img/icons/UsersThree.png",revision:"f4fb3250d823394d4abd45f806cc689e"},{url:"/img/icons/bronze.svg",revision:"09b1b212b8b4e72dc1a73139585d9774"},{url:"/img/icons/globe.png",revision:"57b03800aa73674da437a772bd015995"},{url:"/img/icons/gold.svg",revision:"8cb1a10d3da31b057eae61d76391d2fd"},{url:"/img/icons/handbag.svg",revision:"04752067a41021990a1675ce8ee84a92"},{url:"/img/icons/pid.png",revision:"b32c6769dd15c7e6f8d15597023afcc5"},{url:"/img/icons/silver.svg",revision:"d55c9c3c31d48108ff0349088d6964ff"},{url:"/img/icons/tools.svg",revision:"dea5b51f9f9f6c6353998af2b2849b99"},{url:"/img/icons/wallet.svg",revision:"520957eb88c4494e0dec6e056505ba19"},{url:"/img/map/globe.svg",revision:"11d462016583c291a56fef408978ac31"},{url:"/img/map/map.png",revision:"42f0cc25823f89929d77462f028de380"},{url:"/img/mining-banner.png",revision:"a0a923634361120ae488e027878e54f4"},{url:"/img/mining/dashboard.svg",revision:"4e35642f111411efcc21f72171ae3dd6"},{url:"/img/mining/database.svg",revision:"be1a950392a8befad06079fab8d0ece6"},{url:"/img/mining/email.svg",revision:"98f81be9852582af690e6490f66e9cc8"},{url:"/img/mining/receive-success.png",revision:"ff9958daaacc1f1abf4144f9088cc10a"},{url:"/img/mining/tools.svg",revision:"a39c5e846b86c8dfcbb52d7843aedd0e"},{url:"/img/profile/avatar.png",revision:"f876fb553ef6f555a4bc64666147a1e6"},{url:"/img/profile/gear.svg",revision:"5ec767af28ca0d5c77d7d43a017dd329"},{url:"/img/profile/newspaper.svg",revision:"bddf80acd89593d7a6c1ed461e6dbf7d"},{url:"/img/profile/pid.png",revision:"1089a09f128f54912f43b0c674735d74"},{url:"/img/profile/power.svg",revision:"923f09fb7d9e27706d9cc57af3743571"},{url:"/img/profile/trophy.svg",revision:"151deb5177ad847420fede587f874c51"},{url:"/img/profile/users.svg",revision:"848b67664a47770519094e3020ca8882"},{url:"/img/settings/camera.svg",revision:"d8a4c9a65aa778a3eb10318f82914283"},{url:"/img/settings/cover.png",revision:"99aa1c78c7f42b301428288b80781215"},{url:"/logo.jpg",revision:"51d5aed400660aed6f089e4a52d84131"},{url:"/logo.png",revision:"5f6c8c791793c28cb4495001cd86c79c"},{url:"/manifest.json",revision:"e9888829e9d8070a38808f7105047358"},{url:"/validation-key.txt",revision:"c92947831987fed34b96d484c3e624de"}],{ignoreURLParametersMatching:[]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:s,response:e,event:i,state:a})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;const e=s.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;return!s.pathname.startsWith("/api/")}),new s.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>!(self.origin===s.origin)),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
