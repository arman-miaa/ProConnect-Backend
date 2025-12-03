/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { MessageServices } from "./message.service";

const createMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
 

    const newMessage = await MessageServices.createMessage(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Message submitted successfully",
      data: newMessage,
    });
  }
);

export const MessageControllers = {
  createMessage
}
