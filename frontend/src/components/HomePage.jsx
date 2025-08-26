import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/607/281/desktop-wallpaper-what-is-event-management-event-management.jpg')`,
      }}
    >
  <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>

      <Header />

      {/* Centered Info Section */}
      <div className="flex items-center justify-center h-screen text-center">
        <div className="z-10">
          <h1 className="text-5xl font-extrabold drop-shadow-lg text-white">Eventopia</h1>
          <h3 className="text-2xl mt-4 drop-shadow font-bold text-white">
            PLAN YOUR SPECIAL DAY NOW
          </h3>

          <div className="mt-8">
            <a
              href="/register"
              className="border-2 text-white px-6 py-3 rounded-lg font-semibold hover:text-rose-500 transition"
            >
              GET STARTED!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
