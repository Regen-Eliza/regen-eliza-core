import { ethers } from 'ethers';

/**
 * UniswapSwapService
 * Handles REAL token swaps on Celo using the Uniswap V3 SwapRouter02.
 * Uses StaticJsonRpcProvider to avoid "could not detect network" crashes.
 * NO simulated fallback — errors propagate to the UI for honest feedback.
 */
export class UniswapSwapService {
  private signer: ethers.Signer | null = null;
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private initError: string | null = null;

  private static readonly UNISWAP_ROUTER = '0x5615CDAb10dc425a742d643d949a7F474C01abc4';

  private static readonly TOKENS: Record<string, { address: string; decimals: number }> = {
    'USDC': { address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', decimals: 6 },
    'USDT': { address: '0x48065fbBE25f71C9282ddf5e1cD6D6A88248A9df', decimals: 6 },
    'cUSD': { address: '0x765DE816845861e75A25fCA122bb6898B8B1282a', decimals: 18 },
  };

  constructor(privateKey: string) {
    try {
      this.provider = new ethers.providers.StaticJsonRpcProvider(
        'https://forno.celo.org',
        { name: 'celo', chainId: 42220 }
      );
      this.signer = new ethers.Wallet(privateKey, this.provider);
    } catch (error: any) {
      console.warn('[UniswapSwapService] Init failed:', error?.message);
      this.initError = error?.message || 'Provider initialization failed';
    }
  }

  /**
   * Returns trade details for confirmation UI without executing.
   */
  getTradeDetails(amount: string, fromToken: string = 'USDC', toToken: string = 'USDT') {
    const from = UniswapSwapService.TOKENS[fromToken];
    const to = UniswapSwapService.TOKENS[toToken];
    return {
      amount,
      fromToken,
      toToken,
      fromAddress: from?.address || 'unknown',
      toAddress: to?.address || 'unknown',
      router: UniswapSwapService.UNISWAP_ROUTER,
      chain: 'Celo (42220)',
      fee: '0.05%',
    };
  }

  /**
   * Execute the actual on-chain swap via Uniswap V3 on Celo.
   * No mock fallback — errors propagate to the caller.
   */
  async executeSwap(
    amount: string,
    fromToken: string = 'USDC',
    toToken: string = 'USDT'
  ): Promise<any> {
    if (!this.signer) {
      throw new Error(
        `Swap service unavailable: ${this.initError || 'wallet not initialized'}. ` +
        `Please set NEXT_PUBLIC_REGEN_ELIZA_PRIVATE_KEY in your environment.`
      );
    }

    const from = UniswapSwapService.TOKENS[fromToken];
    const to = UniswapSwapService.TOKENS[toToken];

    if (!from || !to) {
      throw new Error(`Unsupported token pair: ${fromToken} → ${toToken}`);
    }

    const signerAddress = await this.signer.getAddress();
    const amountIn = ethers.utils.parseUnits(amount, from.decimals);

    console.log(`[UniswapSwapService] Swapping ${amount} ${fromToken} → ${toToken} on Celo`);
    console.log(`[UniswapSwapService] Router: ${UniswapSwapService.UNISWAP_ROUTER}`);
    console.log(`[UniswapSwapService] Signer: ${signerAddress}`);

    const swapRouterAbi = [
      'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'
    ];

    const routerContract = new ethers.Contract(
      UniswapSwapService.UNISWAP_ROUTER,
      swapRouterAbi,
      this.signer
    );

    const params = {
      tokenIn: from.address,
      tokenOut: to.address,
      fee: 500,
      recipient: signerAddress,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    const tx = await routerContract.exactInputSingle(params, { gasLimit: 300000 });
    console.log(`[UniswapSwapService] Transaction submitted: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`[UniswapSwapService] Swap confirmed. TX: ${receipt.transactionHash}`);
    return receipt;
  }
}

const defaultKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const pk = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_REGEN_ELIZA_PRIVATE_KEY) || defaultKey;
export const swapService = new UniswapSwapService(pk);
