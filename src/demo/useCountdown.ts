"use client";
import { useEffect, useState } from "react";

const COUNTDOWN_KEY = "demo_countdown_deadline";

export type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  deadline: Date | null;
};

export function useCountdown(expireDays: number = 7): CountdownState {
  const [state, setState] = useState<CountdownState>({
    days: expireDays,
    hours: 23,
    minutes: 59,
    seconds: 59,
    isExpired: false,
    deadline: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const link = window.location.href;
    const stored = localStorage.getItem(COUNTDOWN_KEY);
    const deadlines = stored ? JSON.parse(stored) : {};

    let deadline: Date;
    if (!deadlines[link]) {
      deadline = new Date();
      deadline.setDate(deadline.getDate() + expireDays);
      deadlines[link] = deadline.toISOString();
      localStorage.setItem(COUNTDOWN_KEY, JSON.stringify(deadlines));
    } else {
      deadline = new Date(deadlines[link]);
      // If deadline has passed, reset it
      if (deadline.getTime() <= Date.now()) {
        deadline = new Date();
        deadline.setDate(deadline.getDate() + expireDays);
        deadlines[link] = deadline.toISOString();
        localStorage.setItem(COUNTDOWN_KEY, JSON.stringify(deadlines));
      }
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setState({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          deadline,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setState({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        deadline,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expireDays]);

  return state;
}
