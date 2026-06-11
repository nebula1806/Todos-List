import "./App.css";
import Header from "./MyComponents/Header";
import { Todos } from "./MyComponents/Todos";
import { Footer } from "./MyComponents/Footer";
import { AddTodo } from "./MyComponents/AddTodo";
import { About } from "./MyComponents/About";
import { UserInfo } from "./MyComponents/UserInfo";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  // 1. Initialize Todos from Local Storage
  let initTodo;
  if (localStorage.getItem("todos") === null) {
    initTodo = [];
  } else {
    initTodo = JSON.parse(localStorage.getItem("todos"));
  }

  // 2. All Application State
  const [todos, setTodos] = useState(initTodo);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });
  const [mode, setMode] = useState('light'); // Dark Mode State

  // 3. Save to Local Storage automatically
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 4. Dark Mode Logic
  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = 'white';
    } else {
      setMode('light');
      document.body.style.backgroundColor = '#e0f7fa'; // Your custom cyan background
      document.body.style.color = '#212529';
    }
  };

  // 5. Todo Operations (Delete, Edit, Add)
  const onDelete = (todo) => {
    setTodos(
      todos.filter((e) => {
        return e !== todo;
      })
    );
  };

  const editTodo = (sno, newTitle, newDesc, newDate) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.sno === sno) {
        return { ...todo, title: newTitle, desc: newDesc, date: newDate };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const addTodo = (title, desc, date) => {
    let sno;
    if (todos.length === 0) {
      sno = 0;
    } else {
      sno = todos[todos.length - 1].sno + 1;
    }
    
    // Assign a random pastel color to the row
    const colors = ["#ffcccb", "#d4edda", "#cce5ff", "#fff3cd", "#e2d9f3"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const myTodo = {
      sno: sno,
      title: title,
      desc: desc,
      color: randomColor,
      date: date,
    };
    
    setTodos([...todos, myTodo]);
  };

  // 6. Search and Sorting Logic
  const filteredTodos = todos.filter((todo) => {
    return (
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  filteredTodos.sort((a, b) => {
    if (sortConfig.key === "date") {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return sortConfig.direction === "ascending"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      let aValue = a[sortConfig.key].toLowerCase();
      let bValue = b[sortConfig.key].toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    }
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 7. Render the App
  return (
    <>
      <Router>
        {/* The Anchor Point for Pop-up Notifications */}
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
        
        <Header
          title="My Todos List"
          searchBar={false}
          onSearch={setSearchQuery}
          mode={mode}
          toggleMode={toggleMode}
        />
        
        <Switch>
          
          {/* Main Dashboard (Todos) */}
          <Route
            exact
            path="/"
            render={() => {
              return (
                <>
                  <AddTodo addTodo={addTodo} mode={mode} />
                  <Todos
                    todos={filteredTodos}
                    onDelete={onDelete}
                    onEdit={editTodo}
                    requestSort={requestSort}
                    sortConfig={sortConfig}
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                  />
                </>
              );
            }}
          ></Route>
          
          {/* About Page */}
          <Route exact path="/about">
            <About mode={mode} />
          </Route>

          {/* User Management Dashboard */}
          <Route exact path="/userinfo">
            <UserInfo mode={mode} />
          </Route>
          
        </Switch>
        
        <Footer mode={mode} />
      </Router>
    </>
  );
}

export default App;