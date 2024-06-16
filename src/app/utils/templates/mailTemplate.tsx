export function Template(name: any, mail: any, message: any) {
    let template = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ed Contact me</title>
    <!-- Estilos de Tailwind CSS desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body class="bg-gray-100">

    <!-- Contenedor principal -->
    <div class="max-w-screen-sm mx-auto bg-white p-6 rounded-lg shadow-md">

        <!-- Contenido del correo -->
        <div class="text-center my-20">
            <p class="py-2 text-xl font-semibold text-gray-800 text-center">Nuevo mensaje 👋🏻</p>
            <p class="text-sm">
                Hi Ed, you have a new message from ${name} ${mail}
            </p>
            <p class="text-sm">
                ${message}
            </p>
        </div>

        <!-- Imagen al final -->
        <div class="flex flex-col items-center justify-center">
            <p class="text-center text-gray-400 font-mono text-xs mb-2 drop-shadow-xl">"all that hard work gonna pay off"</p>
            <img src="https://firebasestorage.googleapis.com/v0/b/myportfolio-426417.appspot.com/o/blessed.png?alt=media&token=2734e26a-b29b-4ef0-b480-a48ffe64c564" alt="Bless" width="80" class="rounded-full drop-shadow-xl">
        </div>


        <!-- Pie de página -->
        <div class="text-center mt-4 text-gray-500 text-xs">
            <p>© 2024 EdDev. Todos los derechos reservados.</p>
            <p><a href="#" class="hover:text-blue-600">Política de Privacidad</a> | <a href="#"
                    class="hover:text-blue-600">Términos de Uso</a></p>
        </div>

    </div>

</body>

</html>
    `
    return template
}