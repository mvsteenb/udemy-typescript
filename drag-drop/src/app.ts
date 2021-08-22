// Drag & Drop interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent) : void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
enum ProjectStatus { Active, Finished }

class Project {
  constructor(
      public id: string,
      public title: string,
      public desc: string,
      public people: number,
      public status: ProjectStatus
  ) {
  }
}

// Project state management
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

const projectState = ProjectState.getInstance();   // singleton object

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor;
}

// validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable) : boolean {
  let isValid = true;
  if (validatable.required) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }
  if (validatable.minLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length >= validatable.minLength;
  }
  if (validatable.maxLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length <= validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value >= validatable.min;
  }
  if (validatable.max != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value <= validatable.max;
  }
  return isValid;
}

// Component Base Class
abstract class AbstractComponent<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.hostElement = <T> document.getElementById(hostElementId)!;
    this.templateElement = <HTMLTemplateElement> document.getElementById(templateId)!;

    const importedNode = document.importNode(this.templateElement.content, true); // pointer to content of template
    this.element = <U> importedNode.firstElementChild;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  protected abstract configure(): void;
  protected abstract renderContent(): void;

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
  }
}

// ProjectItemComponent class
class ProjectItemComponent extends AbstractComponent<HTMLUListElement, HTMLLIElement> implements Draggable {

  private project: Project;

  get persons() {
    return this.project.people === 1 ? '1 person' : `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  protected configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  protected renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.desc;
  }

}

// ProjectListComponent class
class ProjectListComponent extends AbstractComponent<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();                                                     // tell Javascript that dropping is allowed !!!!
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.setProjectStatus(
        prjId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  protected configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects:Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active
        }
        return prj.status === ProjectStatus.Finished
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  protected renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = <HTMLUListElement> document.getElementById(`${this.type}-projects-list`)!;

    listEl.innerHTML = ''; // remove all child elements !

    for (const prjItem of this.assignedProjects) {
      new ProjectItemComponent(this.element.querySelector('ul')!.id, prjItem);
    }
  }

}

// ProjectInputComponent class
class ProjectInputComponent extends AbstractComponent<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = <HTMLInputElement> this.element.querySelector('#title')!;
    this.descriptionInputElement = <HTMLInputElement> this.element.querySelector('#description')!;
    this.peopleInputElement = <HTMLInputElement> this.element.querySelector('#people')!;

    this.configure();
    this.renderContent();
  }

  private gatherUserInput() : [string, string, number] | void { // returns a TUPLE
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }
    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5
    }

    if (
        !validate(titleValidatable) ||
        !validate(descValidatable) ||
        !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again !')
      return;
    }
    else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  protected configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this));
  }

  protected renderContent() {
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;          // DESTRUCTURING !
      console.log(title, desc, people);
      this.clearInputs();
      projectState.addProject(title, desc, people);
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

}

const prjInput = new ProjectInputComponent();
const activePrjList = new ProjectListComponent('active');
const finishedPrjList = new ProjectListComponent('finished');