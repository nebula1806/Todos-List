import React, { useState, useEffect } from "react";
import { TodoItem } from "./TodoItem";
import * as XLSX from "xlsx"; 

export const Todos = (props) => {
  // 1. Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 2. Safety Feature: Reset to Page 1 if the user searches or deletes an item!
  useEffect(() => {
    setCurrentPage(1);
  }, [props.todos]);

  // 3. The Pagination Math
  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  // This 'slice' cuts out just the 5 items we need for the current page
  const currentTodos = props.todos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(props.todos.length / itemsPerPage);

  const downloadExcel = () => {
    const formattedData = props.todos.map((todo, index) => {
      return {
        "No.": index + 1,
        "Title": todo.title,
        "Description": todo.desc,
        "Due Date": todo.date || "No Date"
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Todos");
    XLSX.writeFile(workbook, "Todos_List.xlsx");
  };

  return (
    <div className="container">
      
      <div className="d-flex justify-content-between align-items-center my-3">
        <h3 className="m-0">Todos List</h3>
        <div className="d-flex align-items-center">
          <input
            className="form-control form-control-sm me-2"
            type="search"
            placeholder="Search todos..."
            value={props.searchQuery}
            onChange={(e) => props.onSearch(e.target.value)}
            style={{ width: "200px" }} 
          />
          {props.todos.length > 0 && (
            <button className="btn btn-sm btn-success text-nowrap" onClick={downloadExcel}>
              Download Excel ↓
            </button>
          )}
        </div>
      </div>

      {props.todos.length === 0 ? (
        <div className="alert alert-info">No Todos to display!</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle mt-3">
            <thead className="table-dark">
              {/* ... (Your exact same table headers go here, no changes!) ... */}
              <tr>
                <th scope="col">#</th>
                <th scope="col" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => props.requestSort("title")}>
                  Title {props.sortConfig?.key === "title" ? (props.sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th scope="col" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => props.requestSort("desc")}>
                  Description {props.sortConfig?.key === "desc" ? (props.sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th scope="col" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => props.requestSort("date")}>
                  Due Date {props.sortConfig?.key === "date" ? (props.sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              
              {/* 4. We map over 'currentTodos' instead of all of them! */}
              {currentTodos.map((todo, index) => {
                // We add indexOfFirstTodo so row numbers don't reset to 1 on every page!
                const absoluteIndex = indexOfFirstTodo + index; 
                
                return (
                  <TodoItem
                    todo={todo}
                    index={absoluteIndex}
                    key={todo.sno}
                    onDelete={props.onDelete}
                    onEdit={props.onEdit}
                  />
                );
              })}
            </tbody>
          </table>

          {/* 5. The Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-5">
            
            <span className="text-muted text-sm">
              Showing {indexOfFirstTodo + 1} to {Math.min(indexOfLastTodo, props.todos.length)} of {props.todos.length} Todos
            </span>
            
            <nav>
              <ul className="pagination mb-0">
                
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                
                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                  </button>
                </li>

              </ul>
            </nav>
          </div>

        </div>
      )}
    </div>
  );
};