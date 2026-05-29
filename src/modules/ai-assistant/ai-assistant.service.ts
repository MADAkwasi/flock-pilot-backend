import { farmService } from "../farm/farm.service.js";
import type { AskAssistantDto } from "./ai-assistant.schema.js";

class AiAssistantService {
  public async askQuestion(
    farmId: string,
    ownerId: string,
    { content }: AskAssistantDto,
  ) {
    await farmService.ensureOwnedFarm(farmId, ownerId);

    return {
      message: `AI received: ${content}`,
    };
  }
}

export const aiAssistantService = new AiAssistantService();
