import { useEffect, useState } from "react";
//import axios from "axios";

export default function UserSummaryCard() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('token');
      
          const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          if (!response.ok) {
            throw new Error('Error al obtener usuarios');
          }
      
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error al obtener usuarios: ', error);
        }
      };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${editUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editUser)
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }
  
      const updatedUser = await response.json();
  
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      setEditUser(null);
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Resumen de Usuarios</h2>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>email</th>
            <th>Rol</th>
            <th>Creado</th>
            <th>Fin suscripción</th>
            <th>Telegram ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
            {users.map((user) => {
                const isEditing = editUser?._id === user._id;

                return (
                <tr key={user._id} className="border-b">
                    <td>
                    {isEditing ? (
                        <input
                        type="text"
                        name="nombre"
                        value={editUser.nombre}
                        onChange={handleChange}
                        className="border p-1"
                        />
                    ) : (
                        user.nombre
                    )}
                    </td>
                    <td>
                    {isEditing ? (
                        <input
                        type="text"
                        name="apellidos"
                        value={editUser.apellidos}
                        onChange={handleChange}
                        className="border p-1"
                        />
                    ) : (
                        user.apellidos
                    )}
                    </td>
                    <td>
                    {isEditing ? (
                        <input
                        type="text"
                        name="email"
                        value={editUser.email}
                        onChange={handleChange}
                        className="border p-1"
                        />
                    ) : (
                        user.email
                    )}
                    </td>
                    <td>
                    {isEditing ? (
                        <select
                        name="role"
                        value={editUser.role}
                        onChange={handleChange}
                        className="border p-1"
                        >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        </select>
                    ) : (
                        user.role
                    )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                    {isEditing ? (
                        <input
                        type="date"
                        name="proUntil"
                        value={
                            editUser.proUntil
                            ? editUser.proUntil.slice(0, 10)
                            : ""
                        }
                        onChange={handleChange}
                        className="border p-1"
                        />
                    ) : user.proUntil ? (
                        new Date(user.proUntil).toLocaleDateString()
                    ) : (
                        "-"
                    )}
                    </td>
                    <td>
                    {isEditing ? (
                        <input
                        type="text"
                        name="telegramId"
                        value={editUser.telegramId}
                        onChange={handleChange}
                        className="border p-1"
                        />
                    ) : (
                        user.telegramId
                    )}
                    </td>
                    <td>
                    {isEditing ? (
                        <>
                        <button
                            onClick={handleSave}
                            className="text-green-600 hover:underline mr-2"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => setEditUser(null)}
                            className="text-gray-600 hover:underline"
                        >
                            Cancelar
                        </button>
                        </>
                    ) : (
                        <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(user)}
                        >
                        Editar
                        </button>
                    )}
                    </td>
                </tr>
                );
            })}
            </tbody>
      </table>

      
    </div>
  );
}
