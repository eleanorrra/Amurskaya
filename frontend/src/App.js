import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './components/header/header.tsx';
import MainPage from './components/main.tsx';
import TodoListPage from './components/todolist/todolist.tsx';
import MyToDoLists from "./components/todolist/my_todolists.tsx";
import Contacts from "./components/contacts/contacts.tsx";
import Profile from "./components/profile/profile.tsx";
import SplitWise from "./components/splitwise/splitWise.tsx";
import SplitWisePage from "./components/splitwise/splitWisePage.tsx";

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header/>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/todo-list" element={<MyToDoLists userId={123}/>}/>
                    <Route path="/todo-list/:id" element={<TodoListPage myUserId={123}/>}/>
                    <Route path="/split-wise" element={<SplitWise userId={123}/>}/>
                    <Route path="/split-wise/:id" element={<SplitWisePage myUserId={123}/>}/>
                    <Route path="/contacts" element={<Contacts userId={123}/>}/>
                    <Route path="profile" element={<Profile userId={123}/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
