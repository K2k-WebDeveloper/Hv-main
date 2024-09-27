import { io } from "socket.io-client";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";

export const useSocket = () => {
  return io.connect(endpoints.socket.index,{
    auth: {
      _id: pitLib.auth.get()._id
    },
  });
}
