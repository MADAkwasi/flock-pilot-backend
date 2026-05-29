import type { Request, Response } from "express";
import { aiAssistantService } from "./ai-assistant.service.js";
import { farmParamSchema } from "../farm/farm.scheme.js";

class AiAssistantController {
  public static async askAssistant(req: Request, res: Response) {
    const { userId, body } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const response = await aiAssistantService.askQuestion(farmId, userId, body);

    res.status(200).json({
      status: "success",
      data: {
        response,
      },
    });
  }
}

export default AiAssistantController;
