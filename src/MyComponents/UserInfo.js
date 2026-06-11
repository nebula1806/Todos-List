import React, { useState } from 'react';
import { defaultUserData, blankUser } from './userData';
import { FaEdit, FaCheck, FaTimes, FaPlus, FaUpload } from 'react-icons/fa'; 
import { parseUserCSV } from './csvParser'; 
import { toast } from 'react-toastify';

// We accept the 'mode' prop here so the card can turn dark!
export const UserInfo = ({ mode }) => {
    
    const [users, setUsers] = useState([defaultUserData]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const currentUser = users[selectedIndex];

    const handleMainChange = (e) => {
        const updatedUsers = [...users];
        updatedUsers[selectedIndex] = { 
            ...currentUser, 
            [e.target.name]: e.target.value 
        };
        setUsers(updatedUsers);
    };

    const handleAddressChange = (e, type) => {
        const updatedUsers = [...users];
        updatedUsers[selectedIndex] = {
            ...currentUser, 
            [type]: {                   
                ...currentUser[type],          
                [e.target.name]: e.target.value 
            }
        };
        setUsers(updatedUsers);
    };

    const addNewUser = () => {
        const newUser = { ...blankUser, name: "New User" };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setSelectedIndex(updatedUsers.length - 1);
        setIsEditing(true);
    };

    // The Bulk CSV Upload Logic
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { validUsers, errorCount } = await parseUserCSV(file);

            if (validUsers.length > 0) {
                setUsers((prevUsers) => [...prevUsers, ...validUsers]);
                toast.success(`Successfully added ${validUsers.length} users!`);
            }
            if (errorCount > 0) {
                toast.error(`Skipped ${errorCount} invalid rows (missing name or email).`);
            }
        } catch (error) {
            toast.error("Error reading the CSV file.");
            console.error(error);
        } finally {
            e.target.value = null; 
        }
    };

    return (
        <div className="container my-4">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className={`m-0 ${mode === 'dark' ? 'text-light' : ''}`}>User Management</h3>
                
                <div className="d-flex gap-2">
                    <div>
                        <input 
                            type="file" 
                            accept=".csv" 
                            id="csvUpload" 
                            onChange={handleFileUpload} 
                            style={{ display: "none" }} 
                        />
                        <label htmlFor="csvUpload" className="btn btn-outline-success m-0" style={{ cursor: "pointer" }}>
                            <FaUpload className="me-2" /> Upload CSV
                        </label>
                    </div>
                    <button className="btn btn-primary" onClick={addNewUser}>
                        <FaPlus className="me-2" /> Add New User
                    </button>
                </div>
            </div>
            
            <div className="row">
                {/* LEFT COLUMN: User List */}
                <div className="col-md-3 mb-4">
                    <div className="list-group shadow-sm">
                        {users.map((u, index) => (
                            <button 
                                key={index}
                                className={`list-group-item list-group-item-action ${selectedIndex === index ? 'active' : ''} ${mode === 'dark' && selectedIndex !== index ? 'bg-dark text-light border-secondary' : ''}`}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    setIsEditing(false); 
                                }}
                            >
                                {u.name || "Unnamed User"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: User Details Card */}
                <div className="col-md-9">
                    {/* Dark Mode applied to the Card! */}
                    <div className={`card shadow-sm border-0 mb-5 ${mode === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                        
                        <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Profile Details</h5>
                            {isEditing ? (
                                <div>
                                    <button className="btn btn-sm btn-success me-2" onClick={() => setIsEditing(false)} title="Save Profile">
                                        <FaCheck /> Save
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => setIsEditing(false)} title="Cancel">
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            ) : (
                                <button className="btn btn-sm btn-light text-dark" onClick={() => setIsEditing(true)} title="Edit Profile">
                                    <FaEdit /> Edit
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body">
                            
                            <h6 className="text-muted border-bottom pb-2 mb-3">Personal Information</h6>
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3 fw-bold">Full Name:</div>
                                <div className="col-md-9">
                                    {isEditing ? <input type="text" className="form-control form-control-sm" name="name" value={currentUser.name} onChange={handleMainChange} /> : currentUser.name}
                                </div>
                            </div>
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3 fw-bold">Email Address:</div>
                                <div className="col-md-9">
                                    {isEditing ? <input type="email" className="form-control form-control-sm" name="email" value={currentUser.email} onChange={handleMainChange} /> : currentUser.email}
                                </div>
                            </div>
                            <div className="row mb-4 align-items-center">
                                <div className="col-md-3 fw-bold">Phone Number:</div>
                                <div className="col-md-9">
                                    {isEditing ? <input type="text" className="form-control form-control-sm" name="phone" value={currentUser.phone} onChange={handleMainChange} /> : currentUser.phone}
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-6 border-end">
                                    <h6 className="text-muted border-bottom pb-2 mb-3">Billing Address</h6>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">Line 1:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="line1" value={currentUser.billingAddress.line1} onChange={(e) => handleAddressChange(e, 'billingAddress')} /> : currentUser.billingAddress.line1}
                                        </div>
                                    </div>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">Line 2:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="line2" value={currentUser.billingAddress.line2} onChange={(e) => handleAddressChange(e, 'billingAddress')} /> : currentUser.billingAddress.line2}
                                        </div>
                                    </div>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">City:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="city" value={currentUser.billingAddress.city} onChange={(e) => handleAddressChange(e, 'billingAddress')} /> : currentUser.billingAddress.city}
                                        </div>
                                    </div>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">Pin Code:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="pinCode" value={currentUser.billingAddress.pinCode} onChange={(e) => handleAddressChange(e, 'billingAddress')} /> : currentUser.billingAddress.pinCode}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <h6 className="text-muted border-bottom pb-2 mb-3">Shipping Address</h6>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">Line 1:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="line1" value={currentUser.shippingAddress.line1} onChange={(e) => handleAddressChange(e, 'shippingAddress')} /> : currentUser.shippingAddress.line1}
                                        </div>
                                    </div>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">Line 2:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="line2" value={currentUser.shippingAddress.line2} onChange={(e) => handleAddressChange(e, 'shippingAddress')} /> : currentUser.shippingAddress.line2}
                                        </div>
                                    </div>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">City:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="city" value={currentUser.shippingAddress.city} onChange={(e) => handleAddressChange(e, 'shippingAddress')} /> : currentUser.shippingAddress.city}
                                        </div>
                                    </div>
                                    <div className="row mb-2 align-items-center">
                                        <div className="col-sm-4 fw-bold">Pin Code:</div>
                                        <div className="col-sm-8">
                                            {isEditing ? <input type="text" className="form-control form-control-sm" name="pinCode" value={currentUser.shippingAddress.pinCode} onChange={(e) => handleAddressChange(e, 'shippingAddress')} /> : currentUser.shippingAddress.pinCode}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}