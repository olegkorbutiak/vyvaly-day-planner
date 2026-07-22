"use client";

import { useState } from "react";
import { MicIcon } from "@/components/icons";
import { useTasks } from "@/lib/tasks-context";
import { useSpeechRecognition } from "@/lib/use-speech-recognition";

export default function CapturePage() {
  const { addTask } = useTasks();
  const [text, setText] = useState("");
  const [baseText, setBaseText] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  const { isListening, isSupported, toggle } = useSpeechRecognition((transcript) => {
    setText(baseText ? `${baseText} ${transcript}`.trim() : transcript);
  });

  const handleMicClick = () => {
    if (!isListening) setBaseText(text);
    toggle();
  };

  const handleSave = () => {
    if (!text.trim()) return;
    addTask(text);
    setText("");
    setBaseText("");
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Що в голові?"
          autoFocus
          className="h-full w-full resize-none bg-transparent text-2xl leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-300 dark:text-neutral-50 dark:placeholder:text-neutral-700"
        />
      </div>

      <div className="flex flex-col items-center gap-3 px-5 pb-5">
        <p
          className={`text-sm font-medium text-emerald-600 transition-opacity ${
            showSaved ? "opacity-100" : "opacity-0"
          }`}
        >
          Додано в Inbox
        </p>

        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={handleMicClick}
            disabled={!isSupported}
            aria-pressed={isListening}
            aria-label={isListening ? "Зупинити диктування" : "Диктувати голосом"}
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white transition disabled:opacity-30 ${
              isListening ? "animate-pulse bg-red-500" : "bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900"
            }`}
          >
            <MicIcon className="h-7 w-7" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!text.trim()}
            className="h-16 flex-1 rounded-full bg-neutral-900 text-lg font-semibold text-white transition disabled:opacity-30 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Зберегти
          </button>
        </div>

        {!isSupported && (
          <p className="text-center text-xs text-neutral-400">
            Диктування голосом не підтримується в цьому браузері — можна просто писати текст.
          </p>
        )}
      </div>
    </div>
  );
}
