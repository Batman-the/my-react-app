import React, { useState } from 'react';

const allGames = Array.from({ length: 270 }, (_, index) => ({
  name: `Cyberpunk 2077 (${index + 1})`,
  img: `https://example.com/game${index + 1}.jpg`,
  desc: `Experience the excitement of Cyberpunk 2077 (${index + 1}).`,
  details: "A detailed PC game with immersive gameplay and stunning graphics."
}));

const Card = () => {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", date: "" });
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 9;

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(allGames.length / gamesPerPage);

  return (
    <section id="games" className="px-6 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Top Downloadable PC Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentGames.map((game, i) => (
          <div
            key={i}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
            onClick={() => {
              setSelected(game);
              setShowForm(false);
              setSubmitted(false);
              setFormData({ name: "", email: "", date: "" });
            }}
          >
            <img src={game.img} alt={game.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-green-700">{game.name}</h3>
              <p className="text-gray-600">{game.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-2xl"
            >
              &times;
            </button>

            {!showForm ? (
              <>
                <img src={selected.img} alt={selected.name} className="w-full h-48 object-cover rounded" />
                <h3 className="text-2xl font-bold mt-4 text-blue-800">{selected.name}</h3>
                <p className="text-gray-700 mt-2">{selected.details}</p>
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => setShowForm(true)}
                >
                  Download
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Fill the form to get download link</h3>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </form>
            )}

            {submitted && <p className="mt-4 text-green-600 font-medium">Download link has been sent to your email!</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default Card;
