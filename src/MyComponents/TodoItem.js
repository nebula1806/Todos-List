import React, { useState } from 'react';
// 1. Import the specific icons we want to use!
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

export const TodoItem = ({ todo, index, onDelete, onEdit }) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDesc, setEditDesc] = useState(todo.desc);
    const [editDate, setEditDate] = useState(todo.date || "");

    const handleSave = () => {
        onEdit(todo.sno, editTitle, editDesc, editDate);
        setIsEditing(false); 
    };

    return (
        <tr style={{ backgroundColor: todo.color || "aliceblue" }}>
           <th scope="row">{index + 1}</th>
           
           {isEditing ? (
               // --- EDITING MODE ---
               <>
                   <td><input type="text" className="form-control form-control-sm" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /></td>
                   <td><input type="text" className="form-control form-control-sm" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} /></td>
                   <td><input type="date" className="form-control form-control-sm" value={editDate} onChange={(e) => setEditDate(e.target.value)} /></td>
                   <td className="text-nowrap">
                       {/* Save Button (Green Checkmark) */}
                       <button 
                         className="btn btn-sm btn-success me-2" 
                         onClick={handleSave} 
                         title="Save"
                       >
                         <FaCheck />
                       </button>
                       
                       {/* Cancel Button (Gray X) */}
                       <button 
                         className="btn btn-sm btn-secondary" 
                         onClick={() => setIsEditing(false)} 
                         title="Cancel"
                       >
                         <FaTimes />
                       </button>
                   </td>
               </>
           ) : (
               // --- NORMAL MODE ---
               <>
                   <td className="fw-bold">{todo.title}</td>
                   <td>{todo.desc}</td>
                   <td>{todo.date ? todo.date : <span className="text-muted">No Date</span>}</td>
                   <td className="text-nowrap">
                       
                       {/* Edit Button (Green Pen) */}
                       <button 
                         className="btn btn-sm btn-success me-2" 
                         onClick={() => setIsEditing(true)} 
                         title="Edit Todo"
                       >
                         <FaEdit />
                       </button>
                       
                       {/* Delete Button (Red Trash Can) */}
                       <button 
                         className="btn btn-sm btn-danger" 
                         onClick={() => { onDelete(todo) }} 
                         title="Delete Todo"
                       >
                         <FaTrash />
                       </button> 
                       
                   </td>
               </>
           )}
        </tr>
    )
}