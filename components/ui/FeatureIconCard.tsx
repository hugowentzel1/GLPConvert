"use client";

interface Props {
  title: string;
  caption: string;
  emoji?: string;
}
export default function FeatureIconCard({
  title,
  caption,
  emoji = "⚡",
}: Props) {
  return (
    <div className="card p-8 text-center">
      <div
        className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center text-4xl"
        style={{
          background:
            "linear-gradient(140deg, var(--sun-1), var(--sun-2), var(--sun-3))",
          color: "#fff",
        }}
      >
        {emoji}
      </div>
      <div className="h2 mt-4">{title}</div>
      <p className="p mt-2">{caption}</p>
    </div>
  );
}
