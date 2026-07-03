// Shared green orb background — same recipe as the landing hero so every
// page sits on the identical atmosphere. No blur filter (softness is baked
// into the gradient) so it stays cheap and correct on iOS Safari.
export function OrbBackground() {
  return (
    <>
      <div
        className="animate-orb-drift"
        style={{
          position: "absolute",
          top: "12vh",
          left: "50%",
          width: "min(120vw, 900px)",
          height: "min(120vw, 900px)",
          background:
            "radial-gradient(circle, rgba(47, 191, 143, 0.42) 0%, rgba(47, 191, 143, 0.16) 34%, rgba(5, 30, 18, 0.05) 58%, transparent 74%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="animate-orb-drift"
        style={{
          position: "absolute",
          top: "98vh",
          left: "74%",
          width: "min(100vw, 720px)",
          height: "min(100vw, 720px)",
          background:
            "radial-gradient(circle, rgba(47, 191, 143, 0.30) 0%, rgba(47, 191, 143, 0.12) 34%, rgba(5, 30, 18, 0.04) 58%, transparent 74%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          transform: "translate(-50%, -50%)",
          animationDelay: "-8s",
        }}
      />
    </>
  );
}
