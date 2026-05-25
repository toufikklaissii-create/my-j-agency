import Spline from "@splinetool/react-spline";

export default function HeroSpline() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-100">

      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
      />

      {/* EXTRA DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

    </div>
  );
}