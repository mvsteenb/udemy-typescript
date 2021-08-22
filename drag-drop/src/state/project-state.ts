// Project state management
import {Project, ProjectStatus} from "../models/project";

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, description: string, numPeople: number) {
    const newProject = new Project(
        Math.random().toString(),
        title,
        description,
        numPeople,
        ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.notifyListeners();
  }

  setProjectStatus(prjId: string, newStatus: ProjectStatus) {
    const prj = this.projects.find(prj => prj.id === prjId);
    if (prj && prj.status !== newStatus) {
      prj.status = newStatus;
      this.notifyListeners();
    }
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  private notifyListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());            // SLICE : pass a copy of the array to the function !
    }
  }
}

export const projectState = ProjectState.getInstance();   // singleton object
