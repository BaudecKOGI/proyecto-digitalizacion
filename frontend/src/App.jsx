import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import EditorPanel from './pages/EditorPanel';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* La página web pública que ve todo el mundo */}
        <Route path="/" element={<PublicHome />} />
        
        {/* Tu panel privado de editor */}
        <Route path="/editor" element={<EditorPanel />} />
      </Routes>
    </Router>
  );
}