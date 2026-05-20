import type { Response } from "express";

export const setCookieHeaderAndSendResponse = (
  res: Response,
  statusCode: number,
  token: string,
) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(statusCode).json({
    status: "success",
  });
};

// res.cookie("jwt", token, {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",
// });
