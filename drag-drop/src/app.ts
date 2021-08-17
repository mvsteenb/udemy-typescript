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
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());       // SLICE : pass a copy of the array to the function !
    }
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
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
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = <HTMLTemplateElement> document.getElementById(templateId)!;
    this.hostElement = <T> document.getElementById(hostElementId)!;

    const importedNode = document.importNode(this.templateElement.content, true); // pointer to content of template
    this.element = <U> importedNode.firstElementChild;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  abstract configure(): void;
  abstract renderContent(): void;

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
  }

}

// ProjectListComponent class
class ProjectListComponent extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', true, `${type}-projects`);
    this.assignedProjects = [];

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

    this.renderContent();
  }

  protected configure() {
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
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }


}

// ProjectInputComponent class
class ProjectInputComponent extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', false, 'user-input');

    this.titleInputElement = <HTMLInputElement> this.element.querySelector('#title')!;
    this.descriptionInputElement = <HTMLInputElement> this.element.querySelector('#description')!;
    this.peopleInputElement = <HTMLInputElement> this.element.querySelector('#people')!;

    this.configure();
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