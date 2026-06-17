import React, { useState } from 'react';
import { defaultUserData, blankUser } from './userData';
import { FaEdit, FaCheck, FaTimes, FaPlus, FaUpload, FaFilePdf ,FaTrash, FaSearch } from 'react-icons/fa'; 
import { parseUserCSV } from './csvParser'; 
import { toast } from 'react-toastify';
import { generateUserPDF } from './pdfGenerator';

export const UserInfo = ({ mode }) => {
    
    const [users, setUsers] = useState([defaultUserData]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
        setSearchTerm("");
    };

    const deleteUser = () => {
        if (window.confirm("Are you sure?")){
            const updatedUsers = users.filter((__, index) => index !== selectedIndex);
            setUsers(updatedUsers);
            setIsEditing(false);
            toast.success("User deleted succesfully")

            if(selectedIndex >- updatedUsers.length){
                setSelectedIndex(Math.max(0, updatedUsers.length - 1));
            }
        }
    };

    const handleSaveProfile = () => {
        if (!currentUser.email || currentUser.email.trim() === "") {
            toast.error("Email address cant be blank");
            return;
        }

        const isDuplicate = users.some((u, index) => {
            return index !== selectedIndex && 
                   u.email && 
                   u.email.toLowerCase() === currentUser.email.toLowerCase();
        });

        if (isDuplicate) {
            toast.error("Error: A user with this email already exists!");
            return; 
        }

        setIsEditing(false);
        toast.success("Profile saved securely!");
    };


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { validUsers, errorCount } = await parseUserCSV(file);

            const existingEmails = new Set(users.map(u => u.email ? u.email.toLowerCase() : ""));
            
            const strictlyNewUsers = [];
            let duplicateCount = 0;

            validUsers.forEach(newUser => {
                const emailLower = newUser.email.toLowerCase();
                
                if (existingEmails.has(emailLower)) {
                    duplicateCount++;
                } else {
                    strictlyNewUsers.push(newUser);
                    existingEmails.add(emailLower); 
                }
            });

            if (strictlyNewUsers.length > 0) {
                setUsers((prevUsers) => [...prevUsers, ...strictlyNewUsers]);
                toast.success(`Successfully added ${strictlyNewUsers.length} new users!`);
            }
            
            if (duplicateCount > 0) {
                toast.warn(`Blocked ${duplicateCount} duplicate emails.`);
            }

            if (errorCount > 0) {
                toast.error(`Skipped ${errorCount} invalid rows (missing data).`);
            }

        } catch (error) {
            toast.error("Error reading the CSV file.");
            console.error(error);
        } finally {
            e.target.value = null; 
        }
    };

    const downloadPDF = () => {
        try {
            generateUserPDF(users);
            toast.success("PDF Report Downloaded!");
        } catch (error) {
            toast.error("Failed to generate PDF.");
            console.error(error);
        }
    };

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = user?.name?.toLowerCase().includes(searchLower);
        const emailMatch = user?.email?.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch; 
    });


    return (
        <div className="container my-4">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className={`m-0 ${mode === 'dark' ? 'text-light' : ''}`}>User Management</h3>
                
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-danger" onClick={downloadPDF} title="Download PDF Report">
                        <FaFilePdf className="me-2" /> Export PDF
                    </button>
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
                {/* LEFT COLUMN: Sidebar */}
                <div className="col-md-3 mb-4">
                    
                    {/* 4. THE NEW SEARCH BAR UI */}
                    <div className="input-group mb-3 shadow-sm">
                        <span className={`input-group-text ${mode === 'dark' ? 'bg-dark text-secondary border-secondary' : 'bg-light'}`}>
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            className={`form-control ${mode === 'dark' ? 'bg-dark text-light border-secondary' : ''}`} 
                            placeholder="Search names or emails..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="list-group shadow-sm" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        
                        {/* We now map over 'filteredUsers' instead of 'users' */}
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u, index) => {
                                // Find this user's true index in the main array to avoid the Index Trap!
                                const trueIndex = users.indexOf(u); 
                                return (
                                    <button 
                                        key={trueIndex}
                                        className={`list-group-item list-group-item-action ${selectedIndex === trueIndex ? 'active' : ''} ${mode === 'dark' && selectedIndex !== trueIndex ? 'bg-dark text-light border-secondary' : ''}`}
                                        onClick={() => {
                                            setSelectedIndex(trueIndex);
                                            setIsEditing(false); 
                                        }}
                                    >
                                        {u.name || "Unnamed User"}
                                    </button>
                                );
                            })
                        ) : (
                            // What happens if they search for someone who doesn't exist?
                            <div className={`p-3 text-center ${mode === 'dark' ? 'text-secondary' : 'text-muted'}`}>
                                <small>No users match your search.</small>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Profile Card */}
                <div className="col-md-9">
                    {users.length === 0 ? (
                        <div className={`card shadow-sm border-0 mb-5 p-5 text-center ${mode === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-light'}`}>
                            <h4 className={`fw-bold ${mode === 'dark' ? 'text-light' : 'text-muted'}`}>No users found</h4>
                            <p className={mode === 'dark' ? 'text-secondary' : 'text-muted'}>Upload a CSV or click "Add New User" to get started.</p>
                        </div>
                    ) : (
                        <div className={`card shadow-sm border-0 mb-5 ${mode === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                            <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Profile Details</h5>
                                {isEditing ? (
                                    <div>
                                        <button className="btn btn-sm btn-success me-2" onClick={handleSaveProfile} title="Save Profile">
                                            <FaCheck /> Save
                                        </button>
                                        <button className="btn btn-sm btn-light text-dark" onClick={() => setIsEditing(false)} title="Cancel">
                                            <FaTimes /> Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button className="btn btn-sm btn-light text-dark me-2" onClick={() => setIsEditing(true)} title="Edit Profile">
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={deleteUser} title="Delete User">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
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
                    )}
                </div>
            </div>
        </div>
    )
}