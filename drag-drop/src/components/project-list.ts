
/// <reference path='../decorators/autobind.ts' />
/// <reference path='../state/project-state.ts' />
/// <reference path='../models/project.ts' />
/// <reference path='../models/drag-drop.ts' />
/// <reference path='base-component.ts' />
/// <reference path='project-item.ts' />

namespace App {
  // ProjectListComponent class
  export class ProjectListComponent extends AbstractComponent<HTMLDivElement, HTMLElement> implements DragTarget {
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

      projectState.addListener((projects: Project[]) => {
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
      const listEl = <HTMLUListElement>document.getElementById(`${this.type}-projects-list`)!;

      listEl.innerHTML = ''; // remove all child elements !

      for (const prjItem of this.assignedProjects) {
        new ProjectItemComponent(this.element.querySelector('ul')!.id, prjItem);
      }
    }

  }
}