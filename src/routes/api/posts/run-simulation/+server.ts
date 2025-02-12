// Importa la función `json` de SvelteKit para devolver respuestas JSON
// src/routes/api/posts/run-simulation/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import mysql, { type Pool } from 'mysql2/promise';

// Conexión a MySQL
const connection: Pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia esto si usas otro usuario
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'server_labconnect' // Nombre de tu base de datos
});

export async function POST(event: RequestEvent) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const data = await event.request.json();

        // Validar que los datos sean una lista
        if (!Array.isArray(data)) {
            return json({ error: 'Los datos deben ser una lista de prácticas' }, { status: 400 });
        }

        // Validar que cada práctica tenga los campos requeridos
        for (const practice of data) {
            const { ampl, fecha_practica, usuario_activo, numero_practica, estado_practica, notas } = practice;
            if (!ampl || !fecha_practica || !usuario_activo || !numero_practica || !estado_practica) {
                return json({ error: 'Todos los campos son requeridos para cada práctica' }, { status: 400 });
            }
        }

        // Insertar todas las prácticas en la tabla `practicas`
        const query =
            'INSERT INTO practicas (fecha_practica, usuario_activo, numero_practica, datos_entrada_practica, estado_practica, notas) VALUES ?';
        const values = data.map((practice) => [
            practice.fecha_practica,
            practice.usuario_activo,
            practice.numero_practica,
            JSON.stringify({ ampl: practice.ampl }), // Guardar `ampl` como JSON
            practice.estado_practica,
            practice.notas
        ]);

        // Ejecutar la consulta con múltiples valores
        //const [results] = await connection.query(query, [values]);
       // const insertedIds = (results as any).insertId; // ID de la primera práctica insertada

       // return json({ message: 'Prácticas registradas correctamente', insertedIds });
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return json({ error: 'Error en el servidor' }, { status: 500 });
    }
}