import React, { useState } from "react";

export const AddTodo = ({ addTodo }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(""); /* use state logic??*/

  const submit = (e) => {
    e.preventDefault();
    if (!title || !desc || !date) {
      alert("Title or Description cannot be blank");
    } else {
      addTodo(title, desc, date);
      setTitle("");
      setDesc("");
      setDate("");
    }
  };
  return (
    <div className="container my-3">
      <h3>Add a Todo</h3>
      <form onSubmit={submit}>
                
                {/* 1. Wrap Title and Description in a single 'row' */}
                <div className="row mb-3">
                    
                    {/* 2. col-md-6 makes this take up exactly half the row */}
                    <div className="col-md-6">
                        <label htmlFor="title" className="form-label">Todo Title</label>
                        {/* Notice I removed the 300px style—Bootstrap handles the width now! */}
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" id="title" />
                    </div>
                    
                    {/* 3. col-md-6 makes this take up the other half! */}
                    <div className="col-md-6">
                        <label htmlFor="desc" className="form-label">Todo Description</label>
                        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="form-control" id="desc" />
                    </div>
                    
                </div>

                {/* The Due Date sits neatly underneath the row */}
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Due Date</label>
                    {/* I added a w-50 class here just to keep the date box from stretching too wide! */}
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control w-50" id="date" />
                </div>

                <button type="submit" className="btn btn-sm btn-success">Add Todo</button>
            </form>
    </div>
  );
};
