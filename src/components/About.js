// src/components/About.js
import React from "react";

const About = () => {
  return (
    <section className="bg-gray-900 text-gray-300 py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-white mb-4 text-center text-shadow-glow">
          Disclaimer for <span className="text-red-500">GameHub</span>
        </h2>

        {/* Welcome message */}
        <p>
          Welcome to <strong>GameHub</strong>!<br /><br />
          At GameHub, we are dedicated to offering our users a premium gaming experience, providing access to a wide range of PC and console games. Please read our Disclaimer, which outlines our commitment to responsible usage, safety, and high-quality content.
        </p>

        {/* Huge Game Library */}
        <h3 className="text-xl font-semibold text-white text-shadow-glow">Huge Game Library</h3>
        <p>
          GameHub hosts a massive library of games across genres — action, adventure, RPG, strategy, and more. Our goal is to provide gamers with a one-stop platform to explore and enjoy their favorite titles.
        </p>

        {/* Instant Downloads */}
        <h3 className="text-xl font-semibold text-white text-shadow-glow">Instant Downloads</h3>
        <p>
          We provide fast and reliable download links, so you can get your games instantly without unnecessary delays. Enjoy seamless downloads and start playing right away.
        </p>

        {/* How to Download */}
        <h3 className="text-xl font-semibold text-white text-shadow-glow">How to Download</h3>
        <p className="whitespace-pre-line">
          1. Click the Download button below and you should be redirected to the links.{"\n"}
          2. Download the game from the given link.{"\n"}
          3. Once downloaded, double-click the game folder and run the pre-installed game.{"\n"}
          4. Run the game as administrator. If you encounter missing DLL errors, install all programs in the <code>_CommonRedist</code> or <code>Redist</code> folder.{"\n"}
          Have fun and enjoy your game!
        </p>

        {/* Credits */}
        <h3 className="text-xl font-semibold text-white text-shadow-glow">Credits</h3>
        <p>
          We acknowledge and give credit to <strong>FitGirl Repack</strong>, <strong>SteamRip</strong>, and <strong>SteamGG</strong> for their contributions to game distribution and packaging.
        </p>

        {/* No piracy support */}
        <h3 className="text-xl font-semibold text-white text-shadow-glow">No Piracy Support</h3>
        <p>
          GameHub does <strong>not support piracy</strong>. All games are provided for educational and demonstration purposes. Users are encouraged to own or purchase original copies whenever possible. We do not host games on our servers and provide links only to responsible third-party sources.
        </p>

        {/* User responsibility */}
        <h3 className="text-xl font-semibold text-white text-shadow-glow">User Responsibility</h3>
        <p>
          By using GameHub, users acknowledge their responsibility to comply with local laws regarding game access. We encourage fair use, respect for intellectual property, and safe gaming practices.
        </p>

        {/* Closing */}
        <p className="text-gray-500 text-sm text-center mt-6">
          Thank you for choosing GameHub! Play responsibly and enjoy your gaming experience.
        </p>

      </div>

      {/* Neon glow styles */}
      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 4px #ff00ff, 0 0 8px #ff00ff;
        }
      `}</style>
    </section>
  );
};

export default About;
