import React, { useEffect, useState } from 'react'
import { getUsersService } from '../services/admin.service'

export default function UsersList() {
    const [Listusers, setUsers] = useState([]);
    useEffect(() => {
        const users = await getUsersService();
        console.log(users);
    })
    return (
        <div>

        </div>
    )
}
