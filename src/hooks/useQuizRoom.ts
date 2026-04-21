import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
  RealtimePresenceState,
} from "@supabase/supabase-js";

interface Participant {
  id: string;
  user_name: string;
  session_id: string;
  is_host: boolean;
  score: number;
  status: string;
}

interface RoomData {
  id: string;
  room_code: string;
  host_name: string;
  host_session_id: string;
  topic: string;
  status: string;
  current_question_index: number;
  quiz_started: boolean;
  question_started_at: string | null;
  room_password: string;
  max_participants: number;
  quiz_mode: "mcq" | "program" | "mixed";
  time_per_question_sec: number;
  question_count?: number;
  timer_paused_at: string | null;
  timer_pause_offset_ms: number;
}

interface AnswerRecord {
  participant_id: string;
  question_index: number;
  selected_option: number;
  is_correct: boolean;
  time_taken_ms: number;
}

interface Reaction {
  id: string;
  user: string;
  emoji: string;
  lane: number;
  drift: number;
  durationMs: number;
}

interface PresenceMeta {
  user_id: string;
  isHost: boolean;
  status: "coding" | string;
  online_at: string;
}

type RoomRow = RoomData;

const REACTION_LANES = [8, 20, 32, 44, 56, 68, 80, 92];

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildReaction(emoji: string, user: string): Reaction {
  const lane = REACTION_LANES[Math.floor(Math.random() * REACTION_LANES.length)];
  const drift = Math.floor(Math.random() * 61) - 30; // -30..30 px
  const durationMs = 1800 + Math.floor(Math.random() * 1200); // 1.8s..3s
  return {
    id: randomId(),
    user,
    emoji,
    lane,
    drift,
    durationMs,
  };
}

export function useQuizRoom(roomCode: string | null) {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myParticipant, setMyParticipant] = useState<Participant | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<PresenceMeta[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomDeleted, setRoomDeleted] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roomRef = useRef<RoomData | null>(null);
  const myParticipantRef = useRef<Participant | null>(null);
  const sessionId = getSessionId();

  const fetchRoom = useCallback(async () => {
    if (!roomCode) return;
    const { data: roomData, error: roomErr } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", roomCode)
      .maybeSingle();

    if (roomErr || !roomData) {
      setError("Room not found");
      setLoading(false);
      return;
    }
    const nextRoom = roomData as unknown as RoomData;
    setRoom(nextRoom);
    roomRef.current = nextRoom;
    setIsPaused(Boolean(nextRoom.timer_paused_at));

    const { data: parts, error: partsErr } = await supabase
      .from("room_participants")
      .select("*")
      .eq("room_id", roomData.id)
      .order("score", { ascending: false });

    if (partsErr) {
      setError(partsErr.message);
    } else if (parts) {
      setParticipants(parts);
      const mine = parts.find((p) => p.session_id === sessionId) || null;
      setMyParticipant(mine);
      myParticipantRef.current = mine;
    }

    // Fetch answers for this room
    const { data: ans, error: answersErr } = await supabase
      .from("room_answers")
      .select("*")
      .eq("room_id", roomData.id);
    if (answersErr) {
      setError(answersErr.message);
    } else if (ans) {
      setAnswers(ans as unknown as AnswerRecord[]);
    }

    setLoading(false);
  }, [roomCode, sessionId]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    myParticipantRef.current = myParticipant;
  }, [myParticipant]);

  useEffect(() => {
    if (!roomCode) return;
    fetchRoom();

    const onRoomChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      if (payload.eventType === "DELETE") {
        setRoomDeleted(true);
        setRoom(null);
        roomRef.current = null;
        setIsPaused(false);
        return;
      }

      if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
        const nextRoom = payload.new as unknown as RoomData;
        setRoom(nextRoom);
        roomRef.current = nextRoom;
        setIsPaused(Boolean(nextRoom.timer_paused_at));
      }
    };

    const channel = supabase
      .channel(`quiz-${roomCode}`)
      .on("presence", { event: "sync" }, () => {
        const state: RealtimePresenceState<PresenceMeta> = channel.presenceState<PresenceMeta>();
        const flattened = Object.values(state).flatMap((presences) => presences);
        setOnlineUsers(flattened);
      })
      .on("presence", { event: "leave" }, async ({ leftPresences }) => {
        const hostLeft = leftPresences.some((presence) => presence.isHost === true);
        if (!hostLeft) return;

        const currentRoom = roomRef.current;
        if (!currentRoom || currentRoom.timer_paused_at) return;

        // Jitter helps avoid many clients writing the same pause update simultaneously.
        const delayMs = Math.floor(Math.random() * 501);
        await new Promise<void>((resolve) => {
          window.setTimeout(() => resolve(), delayMs);
        });

        const latestRoom = roomRef.current;
        if (!latestRoom || latestRoom.timer_paused_at) return;

        const { error: pauseErr } = await supabase
          .from("rooms")
          .update({ timer_paused_at: new Date().toISOString() })
          .eq("id", latestRoom.id)
          .is("timer_paused_at", null);

        if (pauseErr) {
          setError(pauseErr.message);
        }
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `room_code=eq.${roomCode}` },
        onRoomChange
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_participants" },
        () => fetchRoom()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_answers" },
        () => {
          // Refetch answers on change
          if (room?.id) {
            supabase
              .from("room_answers")
              .select("*")
              .eq("room_id", room.id)
              .then(({ data }) => {
                if (data) setAnswers(data as unknown as AnswerRecord[]);
              });
          }
        }
      )
      .on("broadcast", { event: "reaction" }, (payload) => {
        const incoming = payload.payload as { user?: string; emoji?: string };
        if (!incoming?.emoji) return;
        const reaction = buildReaction(incoming.emoji, incoming.user || "anonymous");
        setReactions((prev) => [...prev.slice(-80), reaction]);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const mine = myParticipantRef.current;
          const trackPayload: PresenceMeta = {
            user_id: mine?.id ?? sessionId,
            isHost: Boolean(mine?.is_host),
            status: "coding",
            online_at: new Date().toISOString(),
          };
          const trackResult = await channel.track(trackPayload);
          if (trackResult !== "ok") {
            setError(`Presence track failed: ${trackResult}`);
          }
        }
      });

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, fetchRoom]);

  // Refetch answers when room ID becomes available
  useEffect(() => {
    if (!room?.id) return;
    supabase
      .from("room_answers")
      .select("*")
      .eq("room_id", room.id)
      .then(({ data }) => {
        if (data) setAnswers(data as unknown as AnswerRecord[]);
      });
  }, [room?.id, room?.current_question_index]);

  const startQuiz = useCallback(async () => {
    if (!room) return;
    await supabase
      .from("rooms")
      .update({
        status: "active",
        quiz_started: true,
        current_question_index: 0,
        question_started_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        timer_paused_at: null,
        timer_pause_offset_ms: 0,
      })
      .eq("id", room.id);
  }, [room]);

  const nextQuestion = useCallback(async () => {
    if (!room) return;
    await supabase
      .from("rooms")
      .update({
        current_question_index: room.current_question_index + 1,
        question_started_at: new Date().toISOString(),
        timer_paused_at: null,
        timer_pause_offset_ms: 0,
      })
      .eq("id", room.id);
  }, [room]);

  const previousQuestion = useCallback(async () => {
    if (!room || room.current_question_index <= 0) return;
    await supabase
      .from("rooms")
      .update({
        current_question_index: room.current_question_index - 1,
        question_started_at: new Date().toISOString(),
        timer_paused_at: null,
        timer_pause_offset_ms: 0,
      })
      .eq("id", room.id);
  }, [room]);

  const adjustTime = useCallback(
    async (deltaSec: number) => {
      if (!room || !room.question_started_at) return;
      // Shift question_started_at later (to add time) or earlier (to remove time).
      const current = new Date(room.question_started_at).getTime();
      const shifted = new Date(current + deltaSec * 1000).toISOString();
      await supabase.from("rooms").update({ question_started_at: shifted }).eq("id", room.id);
    },
    [room]
  );

  const resetTimer = useCallback(async () => {
    if (!room) return;
    await supabase
      .from("rooms")
      .update({
        question_started_at: new Date().toISOString(),
        timer_paused_at: null,
        timer_pause_offset_ms: 0,
      })
      .eq("id", room.id);
  }, [room]);

  const pauseTimer = useCallback(async () => {
    if (!room || room.timer_paused_at) return;
    const { error: pauseErr } = await supabase
      .from("rooms")
      .update({ timer_paused_at: new Date().toISOString() })
      .eq("id", room.id);
    if (pauseErr) {
      setError(pauseErr.message);
    }
  }, [room]);

  const resumeTimer = useCallback(async () => {
    if (!room || !room.timer_paused_at) return;
    const pausedDuration = Date.now() - new Date(room.timer_paused_at).getTime();
    const { error: resumeErr } = await supabase
      .from("rooms")
      .update({
        timer_paused_at: null,
        timer_pause_offset_ms: room.timer_pause_offset_ms + pausedDuration,
      })
      .eq("id", room.id);
    if (resumeErr) {
      setError(resumeErr.message);
    }
  }, [room]);

  const resumeRoom = useCallback(async () => {
    const currentRoom = roomRef.current;
    const mine = myParticipantRef.current;
    if (!currentRoom || !mine?.is_host || !currentRoom.timer_paused_at) return;

    const pausedAtMs = new Date(currentRoom.timer_paused_at).getTime();
    if (Number.isNaN(pausedAtMs)) {
      setError("Invalid pause timestamp");
      return;
    }

    const pausedDurationMs = Math.max(0, Date.now() - pausedAtMs);
    const nextOffsetMs = (currentRoom.timer_pause_offset_ms ?? 0) + pausedDurationMs;

    const { error: resumeErr } = await supabase
      .from("rooms")
      .update({
        timer_paused_at: null,
        timer_pause_offset_ms: nextOffsetMs,
      })
      .eq("id", currentRoom.id);

    if (resumeErr) {
      setError(resumeErr.message);
    }
  }, []);

  const endQuiz = useCallback(async () => {
    if (!room) return;
    await supabase
      .from("rooms")
      .update({ status: "finished" })
      .eq("id", room.id);
  }, [room]);

  const submitAnswer = useCallback(
    async (
      questionIndex: number,
      selectedOption: number,
      isCorrect: boolean,
      timeTakenMs: number,
      payload?: Record<string, unknown>,
    ) => {
      if (!room || !myParticipant) return;

      await supabase.from("room_answers").insert({
        room_id: room.id,
        participant_id: myParticipant.id,
        question_index: questionIndex,
        selected_option: selectedOption,
        is_correct: isCorrect,
        time_taken_ms: timeTakenMs,
        ...(payload ? { answer_payload: payload as never } : {}),
      } as never);

      // Update participant score
      const points = isCorrect ? Math.max(10, 100 - Math.floor(timeTakenMs / 1000)) : 0;
      await supabase
        .from("room_participants")
        .update({ score: myParticipant.score + points })
        .eq("id", myParticipant.id);
    },
    [room, myParticipant]
  );

  const sendReaction = useCallback(
    (emoji: string, userName: string) => {
      if (!channelRef.current) return;
      channelRef.current.send({
        type: "broadcast",
        event: "reaction",
        payload: { user: userName, emoji },
      });
      setReactions((prev) => [...prev.slice(-80), buildReaction(emoji, userName)]);
    },
    []
  );

  const leaveRoom = useCallback(async () => {
    if (!myParticipant) return;
    await supabase.from("room_participants").delete().eq("id", myParticipant.id);
  }, [myParticipant]);

  const deleteRoom = useCallback(async () => {
    if (!room) return;
    await supabase.from("room_answers").delete().eq("room_id", room.id);
    await supabase.from("submissions").delete().eq("room_id", room.id);
    await supabase.from("room_participants").delete().eq("room_id", room.id);
    await supabase.from("rooms").delete().eq("id", room.id);
  }, [room]);

  return {
    room,
    participants,
    myParticipant,
    answers,
    reactions,
    loading,
    error,
    roomDeleted,
    onlineUsers,
    isPaused,
    startQuiz,
    nextQuestion,
    previousQuestion,
    adjustTime,
    resetTimer,
    pauseTimer,
    resumeTimer,
    resumeRoom,
    endQuiz,
    submitAnswer,
    sendReaction,
    leaveRoom,
    deleteRoom,
    refetch: fetchRoom,
  };
}
