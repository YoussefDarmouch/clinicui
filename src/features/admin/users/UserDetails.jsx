import React, { useEffect, useState } from 'react'

import { getUserService } from '../services/admin.service'

import { useParams } from 'react-router-dom'

export default function UserDetails() {

    const { id } = useParams();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response = await getUserService(id);

                console.log(response.data);

                setUser(response.data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, [id]);

    if (loading) {
        return <h2>Loading...</h2>
    }

    if (!user) {
        return <h2>User not found</h2>
    }

    return (

        <div>

            <h1>User Details</h1>

            <p>
                <strong>ID:</strong> {user.id}
            </p>

            <p>
                <strong>Name:</strong> {user.name}
            </p>

            <p>
                <strong>Email:</strong> {user.email}
            </p>

            <p>
                <strong>Phone:</strong> {user.phone}
            </p>

            <p>
                <strong>Address:</strong> {user.address}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {user.is_active ? "Active" : "Inactive"}
            </p>

            <p>
                <strong>Roles:</strong>{" "}

                {user.roles?.map(role => role.name).join(', ')}
            </p>

        </div>

    )
}