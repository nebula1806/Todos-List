import React, { useState } from 'react';
import { defaultUserData } from './userData';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; 

export const UserInfo = () => {
    const [user, setUser] = useState(defaultUserData);
    const [isEditing, setIsEditing] = useState(false);
    const handleMainChange = (e) => {
        setUser({
            ...user, 
            [e.target.name] : e.target.value
        });
    };

    const handleAddressChange = (e) => {
        setUser({
            ...user,
            address : {
                ...user.address,
                [e.target.address] : e.target.value
            }
        });
    };

    return (
        <div className="container my-4">
            
            {/* Header Area with the Edit/Save Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">User Information</h3>
                
                {isEditing ? (
                    <div>
                        <button className="btn btn-sm btn-success me-2" onClick={() => setIsEditing(false)} title="Save Profile">
                            <FaCheck /> Save
                        </button>
                        {/* Note: In a real app, Cancel would reload defaultUserData to undo changes! */}
                        <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)} title="Cancel">
                            <FaTimes /> Cancel
                        </button>
                    </div>
                ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)} title="Edit Profile">
                        <FaEdit /> Edit Profile
                    </button>
                )}
            </div>
            
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Profile Details</h5>
                </div>
                
                <div className="card-body">
                    
                    {/*PERSONAL INFO*/}
                    <h6 className="text-muted border-bottom pb-2 mb-3">Personal Information</h6>
                    
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">Full Name:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="name" value={user.name} onChange={handleMainChange} /> : user.name}
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">Email Address:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="email" className="form-control form-control-sm" name="email" value={user.email} onChange={handleMainChange} /> : user.email}
                        </div>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <div className="col-md-3 fw-bold">Phone Number:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="phone" value={user.phone} onChange={handleMainChange} /> : user.phone}
                        </div>
                    </div>

                    {/*ADDRESS*/}
                    <h6 className="text-muted border-bottom pb-2 mb-3">Address Details</h6>
                    
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">Address Line 1:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="line1" value={user.address.line1} onChange={handleAddressChange} /> : user.address.line1}
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">Address Line 2:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="line2" value={user.address.line2} onChange={handleAddressChange} /> : user.address.line2}
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">City:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="city" value={user.address.city} onChange={handleAddressChange} /> : user.address.city}
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">State:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="state" value={user.address.state} onChange={handleAddressChange} /> : user.address.state}
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 fw-bold">Pin Code:</div>
                        <div className="col-md-9">
                            {isEditing ? <input type="text" className="form-control form-control-sm" name="pinCode" value={user.address.pinCode} onChange={handleAddressChange} /> : user.address.pinCode}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}