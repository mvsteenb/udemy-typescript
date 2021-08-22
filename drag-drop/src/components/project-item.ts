import {Draggable} from '../models/drag-drop.js';
import {AbstractComponent} from "./base-component.js";
import {Project} from "../models/project.js";
import {autobind} from "../decorators/autobind.js";

// ProjectItemComponent class
export class ProjectItemComponent extends AbstractComponent<HTMLUListElement, HTMLLIElement> implements Draggable {

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
