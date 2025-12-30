import "./App.css";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import SignIn from "./components/signin";
import Home from "./components/Home";
import Electronics from "./components/Electronics";
import Docs from "./components/Docs";
import Jewellery from "./components/Jewellery";
import Accesories from "./components/Accesories";
import Keys from "./components/Keys";
import Clothes from "./components/Clothes";
import MyProfile from "./components/MyProfile";
import OtherProfile from "./components/OtherProfile";
import SearchResults from "./components/SearchResults";
import WalletPage from "./components/wallet";
import LFMartIntro from "./components/LFMartIntro";
import LFMartMain from "./components/LFMartMain";
import Kindness from "./components/Kindness";
import Premium from "./components/Premium";
import Store from "./components/Store/Store";
import EcomSearchResults from "./components/Store/EcomSearchResults";
import ProductDetail from "./components/Store/ProductDetail";
import CartPage from "./components/CartPage";
import Notification from "./components/Notification";
import ChatPage from "./components/ChatPage";
import Inbox from "./components/Inbox";
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
        <Route path="/lf-mart/kindness" element={<Kindness />} />
        <Route path="/lf-mart/premium" element={<Premium />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/search/:query" element={<EcomSearchResults />} />
        <Route path="/store/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
