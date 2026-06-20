import { ProjectKApp } from "./projectKApp.js";
import "./styles/project-k.css";

const app = new ProjectKApp(document.querySelector("#app"));
app.start();
window.projectK = app;
