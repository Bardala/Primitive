import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { socket } from '../utils/socket';

type State = {
  message: string;
  messages: string[];
};

export const Chat = () => {
  const { id: spaceId } = useParams();
  const [state, setState] = useState<State>({
    message: '',
    messages: [],
  });

  useEffect(() => {
    socket.emit('join_room', spaceId);

    socket.on('from_server', msg => {
      setState(state => ({
        ...state,
        messages: [...state.messages, msg],
      }));
    });
  }, [spaceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      message: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('from_client', { message: state.message, spaceId });
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
