export default function DisclaimerBar() {
  return (
    <div
      data-e2e="disclaimer"
      className="w-screen border-t border-black/10 bg-slate-50"
      style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-slate-600 text-center">
        Estimates are informational only, based on modeled data (NREL PVWatts®
        v8 and current utility rates). Actual results vary by site conditions
        and installation quality. Not a binding quote.
      </div>
    </div>
  );
}
