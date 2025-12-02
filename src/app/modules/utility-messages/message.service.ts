import { IMessage } from "./message-interface";
import { Message } from "./message.model";

const createMessage = async (payload: IMessage) => {
  const result = await Message.create(payload);
  return result;
};


export const MessageServices = {
  createMessage
}