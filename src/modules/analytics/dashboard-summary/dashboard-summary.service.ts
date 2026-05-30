import { getAiResponse, GropRoles } from "../../../config/groq.js";
import { analyticsService } from "../analytics.service.js";
import { insightEngineService } from "../insight-engine/insight-engine.service.js";
import { predictionEngineService } from "../prediction-engine/prediction-engine.service.js";

class DashboardSummaryService {
  public async generateSummary(farmId: string, ownerId: string) {
    const [overview, insights, predictions] = await Promise.all([
      analyticsService.getFarmOverview(farmId, ownerId),

      insightEngineService.generateInsights(farmId),

      predictionEngineService.generatePredictions(farmId),
    ]);

    const prompt = `
You are FlockPilot AI.

Generate a concise farm dashboard briefing.

Keep it:
- short
- practical
- operational
- easy for farmers to understand

DO NOT use markdown.
DO NOT use bullet points.
DO NOT exaggerate problems.

FARM OVERVIEW:
${JSON.stringify(overview, null, 2)}

INSIGHTS:
${JSON.stringify(insights, null, 2)}

PREDICTIONS:
${JSON.stringify(predictions, null, 2)}
`;

    const response = await getAiResponse([
      {
        role: GropRoles.SYSTEM,
        content: prompt,
      },
    ]);

    return {
      summary: response,
      insights,
      predictions,
      overview,
    };
  }
}

export const dashboardSummaryService = new DashboardSummaryService();
