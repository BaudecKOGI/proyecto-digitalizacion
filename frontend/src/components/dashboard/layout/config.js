import { paths } from "@/paths";

export function getNavItems() {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("custom-auth-user") || "{}");
  } catch (e) {}

  const isEditor = user.rol === "EDITOR";

  const allItems = [
    { key: "overview", title: "Dashboard", href: paths.dashboard.overview, icon: "chart-pie" },
    { key: "disenos-3d", title: "Modelos 3D", href: paths.dashboard.disenos3d, icon: "cube" },
    {
      key: "proyectos-digitales",
      title: "Proyectos Digitales",
      href: paths.dashboard.proyectosDigitales,
      icon: "folder",
    },
    { key: "editores", title: "Editores", href: paths.dashboard.editores, icon: "users" },
    { key: "categorias", title: "Categorias", href: paths.dashboard.categorias, icon: "tag" },
    { key: "visualizaciones", title: "Visualizaciones", href: paths.dashboard.visualizaciones, icon: "eye" },
    { key: "perfil", title: "Perfil", href: paths.dashboard.cuenta, icon: "user" },
  ];

  if (isEditor) {
    return allItems.filter((item) => item.key !== "editores");
  }
  return allItems;
}

export const navItems = [
  { key: "overview", title: "Dashboard", href: paths.dashboard.overview, icon: "chart-pie" },
  { key: "disenos-3d", title: "Modelos 3D", href: paths.dashboard.disenos3d, icon: "cube" },
  {
    key: "proyectos-digitales",
    title: "Proyectos Digitales",
    href: paths.dashboard.proyectosDigitales,
    icon: "folder",
  },
  { key: "editores", title: "Editores", href: paths.dashboard.editores, icon: "users" },
  { key: "categorias", title: "Categorias", href: paths.dashboard.categorias, icon: "tag" },
  { key: "visualizaciones", title: "Visualizaciones", href: paths.dashboard.visualizaciones, icon: "eye" },
  { key: "perfil", title: "Perfil", href: paths.dashboard.cuenta, icon: "user" },
];
