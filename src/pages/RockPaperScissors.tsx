import React, { useState } from 'react';

const RockPaperScissors: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<string>('');
  const [computerChoice, setComputerChoice] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<{ id: number; player: string; computer: string; result: string }[]>([]);

  const choices = ['Kéo', 'Búa', 'Bao'];

  const getRandomChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player: string, computer: string) => {
    if (player === computer) {
      return 'Hòa';
    }
    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }
    return 'Thua';
  };

  const playGame = (choice: string) => {
    const compChoice = getRandomChoice();
    const gameResult = determineWinner(choice, compChoice);

    setPlayerChoice(choice);
    setComputerChoice(compChoice);
    setResult(gameResult);

    setHistory(prev => [...prev, { id: Date.now(), player: choice, computer: compChoice, result: gameResult }]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Trò chơi Oẳn Tù Tì</h1>
      <div>
        <h2>Chọn lựa của bạn:</h2>
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => playGame(choice)}
            style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}
          >
            {choice}
          </button>
        ))}
      </div>
      {playerChoice && (
        <div style={{ marginTop: '20px' }}>
          <p>Bạn chọn: <strong>{playerChoice}</strong></p>
          <p>Máy chọn: <strong>{computerChoice}</strong></p>
          <p>Kết quả: <strong>{result}</strong></p>
        </div>
      )}
      <div style={{ marginTop: '30px' }}>
        <h2>Lịch sử các ván đấu:</h2>
        <ul>
          {history.map((game, index) => (
            <li key={game.id}>
              Ván {index + 1}: Bạn ({game.player}) vs Máy ({game.computer}) - {game.result}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RockPaperScissors;