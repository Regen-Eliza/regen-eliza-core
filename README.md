ozkite@pop-os:~/regen-eliza-core/agent-dashboard$ 
^[[200~pnpm dev --webpack^[[201~
pnpm dev --webpack

> regen-eliza-antigravity@0.1.0 dev /home/ozkite/regen-eliza-core/agent-dashboard
> next dev --webpack

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /home/ozkite/package-lock.json as the root directory.
 To silence this warning, set `outputFileTracingRoot` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats for more information.
 Detected additional lockfiles: 
   * /home/ozkite/regen-eliza-core/agent-dashboard/pnpm-lock.yaml

▲ Next.js 16.1.6 (webpack)
- Local:         http://localhost:3000
- Network:       http://192.168.1.126:3000

✓ Starting...
✓ Ready in 1243ms
○ Compiling / ...
⨯ ./services/swapService.ts:1:1
Module not found: Can't resolve '@0xsquid/sdk'
> 1 | import { Squid } from '@0xsquid/sdk';
    | ^
  2 | import { ethers } from 'ethers';
  3 |
  4 | export class SwapService {

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./components/SentientDashboard.tsx
./app/page.tsx
⨯ ./services/swapService.ts:1:1
Module not found: Can't resolve '@0xsquid/sdk'
> 1 | import { Squid } from '@0xsquid/sdk';
    | ^
  2 | import { ethers } from 'ethers';
  3 |
  4 | export class SwapService {

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./components/SentientDashboard.tsx
./app/page.tsx
⨯ ./services/swapService.ts:1:1
Module not found: Can't resolve '@0xsquid/sdk'
> 1 | import { Squid } from '@0xsquid/sdk';
    | ^
  2 | import { ethers } from 'ethers';
  3 |
  4 | export class SwapService {

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./components/SentientDashboard.tsx
./app/page.tsx
 GET / 500 in 13.0s (compile: 13.0s, render: 65ms)


