"use server";

export async function getAgentScore(chainId: number, agentId: string): Promise<number | null> {
  try {
    const chainName = chainId === 42220 ? "celo" : "base";
    const res = await fetch(`https://www.8004scan.io/agents/${chainName}/${agentId}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) {
        return null;
    }

    const text = await res.text();
    // Parse out "total_score":81.21 or similar
    const totalScoreMatch = text.match(/"total_score":([0-9.]+)/);
    if (totalScoreMatch && totalScoreMatch[1]) {
      return parseFloat(totalScoreMatch[1]);
    }
    
    const finalScoreMatch = text.match(/"final_score":([0-9.]+)/);
    if (finalScoreMatch && finalScoreMatch[1]) {
      return parseFloat(parseFloat(finalScoreMatch[1]).toFixed(2));
    }

    return null; // Default fallback if not found
  } catch (err) {
    console.error("Failed to fetch agent score:", err);
    return null; // Fallback
  }
}
