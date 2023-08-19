import { useEffect, useState } from 'react';

import { socket } from '../socket';

type State = {
  message: string;
  messages: string[];
};

export const Chat = () => {
  const [state, setState] = useState<State>({
    message: '',
    messages: [],
  });

  useEffect(() => {
    socket.on('chat message', msg => {
      setState(state => ({
        ...state,
        messages: [...state.messages, msg],
      }));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      message: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('chat message', state.message);
    setState({
      ...state,
      message: '',
    });
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {state.messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={state.message} onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
