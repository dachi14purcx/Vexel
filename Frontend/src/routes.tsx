import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./components/Home/Home";
import Messages from "./components/Messages/Messages";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";

export const routes =  createBrowserRouter([
    { 
        path: '/',
        element: <App/>, 
        children: [
            { index: true, element: <Home /> },
            { path: '/home', element: <Home/> },
            { path: '/messages', element: <Messages/> },
            { path: '/signin', element: <SignIn/>},
            { path: '/signup', element: <SignUp/>}
        ]
    }
])