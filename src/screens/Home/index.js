import { useHistory } from 'react-router-dom';

const hardcodedUserId = '600df968be16b202184159e5';

export default function Home({ router }) {
  const history = useHistory();

  const login = () => history.push(`/users/${hardcodedUserId}`);

  return <button onClick={login}>Log In</button>;
}
