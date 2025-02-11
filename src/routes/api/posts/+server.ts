// Importa la función `json` de SvelteKit para devolver respuestas JSON
import { json } from '@sveltejs/kit';
// Importa el tipo `Post` desde un archivo de definiciones de tipos
import type { Post } from '$lib/types.ts';
// Importa la conexión con la base de datos:
import mysql from 'mysql2/promise';

// Conexión a MySQL
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia esto si usas otro usuario
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'server_labconnect' // Nombre de tu base de datos
});

// Función asíncrona para obtener y procesar las publicaciones
async function getPosts() {
    let posts: Post[] = []; // Inicializa un arreglo vacío para almacenar las publicaciones
    // Usa `import.meta.glob` para cargar dinámicamente todos los archivos `.md` en la carpeta `$lib/posts/`
    const paths = import.meta.glob('$lib/posts/*.md', { eager: true });
    for (const path in paths) {
        const file = paths[path];
        const slug = path.split('/').at(-1)?.replace('.md', '');
        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata as Omit<Post, 'slug'>;
            const post = { ...metadata, slug } satisfies Post;
            if (post.published) {
                posts.push(post);
            }
        }
    }
    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    );
    return posts;
}

// Endpoint GET que devuelve las publicaciones como una respuesta JSON
export async function GET() {
    const posts = await getPosts();
    return json(posts);
}

/*/ Endpoint POST modificado para recibir una lista de prácticas
export async function POST({ request }) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const data = await request.json();

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
        const [results] = await connection.execute(query, [values]);
        const insertedIds = (results as any).insertId; // ID de la primera práctica insertada

        return json({ message: 'Prácticas registradas correctamente', insertedIds });
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return json({ error: 'Error en el servidor' }, { status: 500 });
    }
} */