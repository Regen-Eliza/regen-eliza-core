export class MarketWatcher {
    private targetAsset: string;
    private threshold: number;

    constructor(asset: string, threshold: number) {
        this.targetAsset = asset;
        this.threshold = threshold;
    }

    async checkPrice(): Promise<boolean> {
        // TODO: Integrate Pyth Oracle here
        console.log(`📈 Checking price for ${this.targetAsset}...`);
        return true; 
    }
}
