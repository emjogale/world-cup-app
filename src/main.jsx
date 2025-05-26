import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TeamsProvider } from './context/TeamsProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
	<TeamsProvider>
		<App />
	</TeamsProvider>
);
