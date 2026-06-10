import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Game({ difficulty = "hard" }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // stores flipped card indices
  const [matched, setMatched] = useState([]); // stores matched names
  const [score, setScore] = useState(0);
  const [lockBoard, setLockBoard] = useState(false);
  const [gameId, setGameId] = useState(0);
  const [missedCards, setMissedCards] = useState([]); //stores mismatched cards

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const query = missedCards.length
          ? `?difficulty=${difficulty}&missed=${missedCards.join(",")}`
          : `?difficulty=${difficulty}`;

        const res = await fetch(`http://localhost:8000/generate-grid${query}`);
        const data = await res.json();

        // Convert data into interleaved image and text cards
        const mixed = [];
        data.forEach((item) => {
          mixed.push({ name: item.name, type: "image", image: `http://localhost:8000/static/${item.img1}` });
          mixed.push({ name: item.name, type: "text" });
        });

        // Shuffle cards
        for (let i = mixed.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
        }

        setCards(mixed);
       // setScore(0);
        setMatched([]);
        setFlipped([]);
        setLockBoard(false);
      } catch (err) {
        console.error("Error fetching game data:", err);
      }
    };

    fetchCards();
  }, [difficulty, gameId]);

  const handleClick = (index) => {
    if (lockBoard || flipped.includes(index) || matched.includes(cards[index].name)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch =
        cards[first].name === cards[second].name &&
        cards[first].type !== cards[second].type;

      setLockBoard(true);
      setTimeout(() => {
        if (isMatch) {
          setMatched([...matched, cards[first].name]);
          setScore((prev) => prev + 1);
        }else if(!isMatch){
          setMissedCards((prev) => {
            const updated = [...prev, cards[first].name, cards[second].name];
            const unique = [...new Set(updated)];
            return unique.slice(-3);
          }
        );
        }
        setFlipped([]);
        setLockBoard(false);
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameId((prev) => prev + 1); // increment gameId to fetch a new set of cards
  };

  const getBorderStyle = (index) => {
    if(flipped.includes(index)) {
      return "4px solid white"; //lights up white for selected/flipped cards
    }
    if(matched.includes(cards[index].name)) {
      return "4px solid limegreen"; //lights up green for matched cards
    }
    return "none"; // no border for unmatched cards
  }

  return (
    <div className="game-container">
      <nav className="navbar">
        <Link to="/Level" className="btn">Back</Link>
        <Link to="/" className="btn">Home</Link>
      </nav>

      <header>
        <h1>Match Photos to Names</h1>
        <p>Score: {score}</p>
      </header>

      <div className="grid-container">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(card.name);
          return (
            <div
              key={index}
              className={`card ${isFlipped ? "flipped" : ""}`}
              style={{border: getBorderStyle(index)}}
              onClick={() => handleClick(index)}
            >
              <div className="card-inner">
                {card.type === "image" ? (
                  <img src={card.image} alt="plant" className="front-image" />
                ) : (
                  <div className="card-front card-text">{card.name.replace(/_/g, " ")}</div>
                )}
                <div className="card-back" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button onClick={resetGame}>Regenerate</button>
      </div>
    </div>
  );
}

export default Game;



