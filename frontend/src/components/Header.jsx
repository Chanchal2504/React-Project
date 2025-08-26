import Logo from "../assets/LastLogo.png";

export default function Header() {
  return (
<header className="flex items-center justify-between px-6 py-2 shadow-md fixed w-full top-0 left-0">
  {/* Logo / Brand on left */}
  <img 
                          src={Logo} 
                          alt="Eventopia" 
                          className="h-15 w-40"
                          
                        />

  {/* Navigation + Buttons on the right */}
  {/* <div className="text-white"> */}
  <div className="flex items-center space-x-8 ml-auto">
    

    {/* Login / Register buttons */}
    <div className="flex space-x-4">
      <a
        href="/login"
        className="px-4 py-2 text-sm font-semibold rounded-lg text-white hover:text-rose-500"
      >
        Login
      </a>
      <a
        href="/register"
        className="px-4 py-2 text-sm font-semibold border  rounded-lg text-white hover:text-rose-500"
      >
        Register
      </a>
    </div>
  </div>
  {/* </div> */}
</header>

  );
}
