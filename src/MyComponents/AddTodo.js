import React, { useState } from 'react';

// 1. We cleanly accept both 'addTodo' and 'mode' as props here
export const AddTodo = ({ addTodo, mode }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!title || !desc) {
            alert("Title or Description cannot be blank");
            return;
        }
        addTodo(title, desc, date);
        setTitle("");
        setDesc("");
        setDate("");
    };

    return (
        <div className="container my-3">
            
            {/* 2. THE FIX: No placeholders! The template literal dynamically adds bg-dark and text-light when mode is 'dark' */}
            <div className={`card shadow-sm border-0 mb-4 ${mode === 'dark' ? 'bg-dark text-light' : ''}`}>
                
                <div className="card-body p-4">
                    <h4 className="card-title mb-4">Add a Todo</h4>
                    
                    <form onSubmit={submit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="title" className="form-label text-muted fw-bold">Todo Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" id="title" placeholder="What needs to be done?" />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="desc" className="form-label text-muted fw-bold">Todo Description</label>
                                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="form-control" id="desc" placeholder="Add some details..." />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="date" className="form-label text-muted fw-bold">Due Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control w-50" id="date" />
                        </div>

                        <button type="submit" className="btn btn-success px-4">
                            Add Todo
                        </button>
                    </form>
                </div>

            </div>
            
        </div>
    );
};