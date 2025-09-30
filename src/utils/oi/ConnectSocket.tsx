"use client";

import { connectSocket, registerSocket } from "@/lib/socketio";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
export default function ConnectSocket() {
  const token = useAppSelector(useCurrentToken);
  const { data } = useGetMeQuery(undefined, { skip: !token });
  const userId = data?.data?.id;
  useEffect(() => {
    connectSocket();
    if (userId) {
      registerSocket(userId);
    }
  }, [userId]);
  return "";
}
