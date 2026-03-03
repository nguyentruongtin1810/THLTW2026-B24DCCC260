import React, { useEffect, useState } from 'react';
import { Button, InputNumber, Space, Typography, Table } from 'antd';

const { Title, Text } = Typography;

const MAX_GUESSES = 10;

const GuessNumber: React.FC = () => {
  const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    // generate target when component mounts
    setTarget(Math.floor(Math.random() * 100) + 1);
  }, []);

  const handleGuess = () => {
    if (finished) return;
    if (guess === null || Number.isNaN(guess)) {
      setMessage('Vui lòng nhập một số hợp lệ (1 - 100)');
      return;
    }
    const g = Number(guess);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setHistory((h) => [...h, g]);

    if (g === target) {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      setFinished(true);
      return;
    }

    if (g < target) setMessage('Bạn đoán quá thấp!');
    else setMessage('Bạn đoán quá cao!');

    if (nextAttempts >= MAX_GUESSES) {
      setFinished(true);
      setMessage(`Bạn đã hết lượt! Số đúng là ${target}.`);
    }
  };

  const handleReset = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess(null);
    setMessage('');
    setAttempts(0);
    setFinished(false);
    setHistory([]);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Trò chơi đoán số (1 - 100)</Title>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text>Bạn có {MAX_GUESSES - attempts} lượt còn lại.</Text>

        <Space>
          <InputNumber
            min={1}
            max={100}
            controls={false}
            value={guess === null ? undefined : guess}
            onChange={(v) => setGuess(v as number | null)}
          />
          <Button type="primary" onClick={handleGuess} disabled={finished}>
            Đoán
          </Button>
          <Button onClick={handleReset}>Chơi lại</Button>
        </Space>

        {message && (
          <div style={{ color: 'red', fontWeight: 'bold' }}>{message}</div>
        )}

        {history.length > 0 && (
          <Table
            dataSource={history.map((num, idx) => ({ key: idx, num }))}
            pagination={false}
            size="small"
          >
            <Table.Column title="Số đoán" dataIndex="num" key="num" />
          </Table>
        )}

      </Space>
    </div>
  );
};

export default GuessNumber;
