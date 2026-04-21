import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import type { Tables } from "@/integrations/supabase/types";

type Room = Tables<"rooms">;

interface RoomWithCount extends Room {
  participant_count: number;
}

const WAITING_TTL_MS = 60 * 60 * 1000;
const ACTIVE_TTL_MS = 2 * 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 60 * 1000;

function deriveStatus(room: Room): Room["status"] {
  const now = Date.now();

  if (room.status === "waiting") {
    const createdAt = new Date(room.created_at).getTime();
    if (!Number.isNaN(createdAt) && now - createdAt > WAITING_TTL_MS) {
      return "cancelled";
    }
  }

  if (room.status === "active" && room.quiz_started && room.started_at) {
    const startedAt = new Date(room.started_at).getTime();
    if (!Number.isNaN(startedAt) && now - startedAt > ACTIVE_TTL_MS) {
      return "finished";
    }
  }

  return room.status;
}

export function useRoomsList() {
  const [rooms, setRooms] = useState<RoomWithCount[]>([]);
  const [myHostedRoomIds, setMyHostedRoomIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  const fetchRooms = async () => {
    // Best-effort local cleanup so abandoned rooms do not linger in UI.
    await supabase
      .from("rooms")
      .update({ status: "finished" })
      .eq("status", "active")
      .eq("quiz_started", true)
      .lt("started_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());

    await supabase
      .from("rooms")
      .update({ status: "cancelled" })
      .eq("status", "waiting")
      .lt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    const { data: roomsData } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (!roomsData) {
      setLoading(false);
      return;
    }

    // Fetch participant counts
    const roomsWithCounts: RoomWithCount[] = await Promise.all(
      roomsData.map(async (room) => {
        const { count } = await supabase
          .from("room_participants")
          .select("*", { count: "exact", head: true })
          .eq("room_id", room.id);
        return {
          ...room,
          status: deriveStatus(room),
          participant_count: count || 0,
        };
      })
    );

    const { data: myHostRows } = await supabase
      .from("room_participants")
      .select("room_id")
      .eq("session_id", sessionId)
      .eq("is_host", true);

    setMyHostedRoomIds((myHostRows ?? []).map((r) => r.room_id));
    setRooms(roomsWithCounts);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
    const interval = window.setInterval(fetchRooms, REFRESH_INTERVAL_MS);

    const channel = supabase
      .channel("rooms-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        () => fetchRooms()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_participants" },
        () => fetchRooms()
      )
      .subscribe();

    return () => {
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return { rooms, myHostedRoomIds, loading, refetch: fetchRooms };
}
