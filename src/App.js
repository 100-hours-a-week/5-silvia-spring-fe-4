import { Routes, Route, useLocation } from 'react-router-dom';
import Home from "./pages/MainPage";
import Board from "./pages/PostPage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import Password from "./pages/PasswordChangePage";
import Profile from "./pages/ProfileEditPage";
import Edit from "./pages/PostEditPage";
import Create from "./pages/PostCreatePage";
import Header from "./components/Header";
import './App.css';
import { ROUTES } from './config/routes'; // 경로 상수를 임포트

function App() {
    const location = useLocation();

    const headerConfig = {
        '/': { showBackButton: false, showUserProfile: true },
        '/post': { showBackButton: true, showUserProfile: true },
        '/login': { showBackButton: false, showUserProfile: false },
        '/register': { showBackButton: true, showUserProfile: false },
        '/password-change': { showBackButton: false, showUserProfile: true },
        '/profile-edit': { showBackButton: false, showUserProfile: true },
        '/post/edit': { showBackButton: true, showUserProfile: true },
        '/post/create': { showBackButton: true, showUserProfile: true },
    };

    const getCurrentHeaderConfig = (pathname) => {
        if (pathname.startsWith('/post/edit')) return headerConfig['/post/edit'];
        if (pathname.startsWith('/post/create')) return headerConfig['/post/create'];
        if (pathname.startsWith('/post')) return headerConfig['/post'];
        return headerConfig[pathname] || { showBackButton: false, showUserProfile: true };
    };

    const currentHeaderConfig = getCurrentHeaderConfig(location.pathname);

    return (
        <div className="App">
            <Header showBackButton={currentHeaderConfig.showBackButton} showUserProfile={currentHeaderConfig.showUserProfile} />
            <div className="CenteredContent" style={{marginBottom: '50px'}}>
                {/* Content Here */}

            <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.POST} element={<Board />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<SignUp />} />
                <Route path={ROUTES.PASSWORD_CHANGE} element={<Password />} />
                <Route path={ROUTES.PROFILE_EDIT} element={<Profile />} />
                <Route path={ROUTES.BOARD_EDIT} element={<Edit />} />
                <Route path={ROUTES.BOARD_CREATE} element={<Create />} />
            </Routes>
            </div>
        </div>
    );
}

export default App;
