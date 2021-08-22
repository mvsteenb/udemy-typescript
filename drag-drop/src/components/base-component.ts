// Component Base Class
export abstract class AbstractComponent<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.hostElement = <T>document.getElementById(hostElementId)!;
    this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;

    const importedNode = document.importNode(this.templateElement.content, true); // pointer to content of template
    this.element = <U>importedNode.firstElementChild;

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
