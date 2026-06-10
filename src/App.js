import "./App.css";
import Header from "./MyComponents/Header";
import { Todos } from "./MyComponents/Todos";
import { Footer } from "./MyComponents/Footer";
import { AddTodo } from "./MyComponents/AddTodo";
import { About } from "./MyComponents/About";
import { UserInfo }from "./MyComponents/UserInfo"
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  let initTodo;
  if (localStorage.getItem("todos") === null) {
    initTodo = [];
  } else {
    initTodo = JSON.parse(localStorage.getItem("todos"));
  }

  const onDelete = (todo) => {
    console.log("I am ondelete of todo", todo);
    // Deleting this way in react does not work
    // let index = todos.indexOf(todo);
    // todos.splice(index, 1);

    setTodos(
      todos.filter((e) => {
        return e !== todo;
      }),
    );
    console.log("deleted", todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  };

const editTodo = (sno, newTitle, newDesc, newDate) => {
  const updatedTodos = todos.map((todo) => {
    if (todo.sno === sno){
      return{...todo, title: newTitle, desc: newDesc, date: newDate};
    }
    return todo;
  });
  setTodos(updatedTodos);
}

  const addTodo = (title, desc, date) => {
    console.log("I am adding this todo", title, desc);
    let sno;
    if (todos.length === 0) {
      sno = 0;
    } else {
      sno = todos[todos.length - 1].sno + 1;
    }
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
    console.log(myTodo);
  };

  const [todos, setTodos] = useState(initTodo);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
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

  return (
    <>
      <Router>
        <Header
          title="My Todos List"
          searchBar={false}
          onSearch={setSearchQuery}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <>
                  <AddTodo addTodo={addTodo} />
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
          
          <Route exact path="/about">
            <About />
          </Route>

          {/* NEW: Your User Info Route! */}
          <Route exact path="/userinfo">
            <UserInfo />
          </Route>
          
        </Switch>
        <Footer />
      </Router>
    </>
  );
}
export default App;
