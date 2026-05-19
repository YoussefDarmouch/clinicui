import React, { useEffect, useState } from 'react'

import {
    getUsersService,
    deleteUserService,
    getUserService
} from '../services/admin.service'

import UserDetails from './UserDetails';
import UserForm from './UserForm';
import { Link } from 'react-router-dom';

export default function UsersList() {

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    // GET ALL USERS
    const fetchUsers = async () => {
        try {
            const res = await getUsersService();
            setUsers(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // DELETE
    const handleDelete = async (id) => {
        try {
            await deleteUserService(id);
            fetchUsers();
        } catch (err) {
            console.log(err);
        }
    };

    // VIEW DETAILS


    // EDIT
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    // ADD
    const handleAdd = () => {
        setSelectedUser(null);
        setShowForm(true);
    };

    return (
        <div>

            <h2>Users List</h2>

            <button onClick={handleAdd}>
                + Add User
            </button>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>View</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map(user => (
                        <tr key={user.id}>

                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>

                            <td>
                                {user.roles?.map(r => r.name).join(', ')}
                            </td>

                            <td>
                                {user.is_active ? "Active" : "Inactive"}
                            </td>

                            <td>
                                <Link to={`/admin/users/${user.id}`}>
                                    View
                                </Link>

                            </td>

                            <td>
                                <button onClick={() => handleEdit(user)}>
                                    Edit
                                </button>
                            </td>

                            <td>
                                <button onClick={() => handleDelete(user.id)}>
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

            {/* FORM */}
            {showForm && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchUsers();
                    }}
                />
            )}

            {/* DETAIL */}
            {showDetail && selectedUser && (
                <UserDetail
                    user={selectedUser}
                    onClose={() => setShowDetail(false)}
                />
            )}

        </div>
    );
}