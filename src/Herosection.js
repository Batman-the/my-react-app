import React from "react";
import Slider from "react-slick";

const Herosect = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    pauseOnHover: false,
  };

  // Game-related background images
  const images = [
    "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", // CS:GO
    "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg", // GTA V
    "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg", // PUBG
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg", // Apex Legends
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg", // Destiny 2
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg", // Elden Ring
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index}>
              <div
                className="h-screen w-full bg-center bg-cover"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
            </div>
          ))}
        </Slider>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Foreground Static Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Discover & Download Epic Games
        </h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow">
          Your one-stop hub for downloading the latest action, adventure, and strategy games. Fast. Free. Fun.
        </p>
        <button className="mt-8 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-500 transition duration-300">
          Browse Games
        </button>
      </div>
    </section>
  );
};

export default Herosect;
