export const paths = {
    home: "/",
    auth: { signIn: "/auth/sign-in", resetPassword: "/auth/reset-password" },
    dashboard: {
        overview: "/dashboard",
        cuenta: "/dashboard/cuenta",
        disenos3d: "/dashboard/disenos-3d",
        proyectosDigitales: "/dashboard/proyectos-digitales",
        editores: "/dashboard/editores",
        categorias: "/dashboard/categorias",
        visualizaciones: "/dashboard/visualizaciones",
    },
    // Bloque del editor:
    editor: {
        proyectos3D: "/editor/3d/proyectos",
        nuevoProyecto3D: "/editor/3d/proyectos/nuevo",
        editarProyecto3D: "/editor/3d/proyectos/editar/:id"
    },
    errors: { notFound: "/errors/not-found" },
};