import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutesDev from './routes/AppRoutesDev';
import './index.css';

function AppDev() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <AppRoutesDev />
      </div>
    </Router>
  );
}

export default AppDev;


