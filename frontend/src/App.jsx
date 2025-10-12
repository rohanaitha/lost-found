import './App.css'
import Login from './components/Login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import SignIn from './components/signin';
import Home from './components/Home';
import Electronics from './components/electronics';
import Docs from './components/Docs';
import Jewellery from './components/Jewellery';
import Accesories from './components/Accesories';
import Keys from './components/Keys';
import Clothes from './components/Clothes';
import MyProfile from './components/MyProfile';
import OtherProfile from './components/OtherProfile';
import SearchResults from './components/SearchResults';
import WalletPage from './components/wallet';
import LFMartIntro from './components/LFMartIntro';
import LFMartMain from './components/LFMartMain';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/jewellery" element={<Jewellery />} />
        <Route path="/accesories" element={<Accesories />} />
        <Route path="/keys" element={<Keys />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/profile/:fullName" element={<OtherProfile />} />
        <Route path="/searchResults/:title" element={<SearchResults />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/lf-mart" element={<LFMartIntro />} />
        <Route path="/lf-mart/main" element={<LFMartMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
