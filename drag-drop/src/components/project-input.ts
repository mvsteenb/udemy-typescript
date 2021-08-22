
/// <reference path='../state/project-state.ts' />
/// <reference path='../util/validation.ts' />
/// <reference path='../decorators/autobind.ts' />
/// <reference path='base-component.ts' />

namespace App {
  // ProjectInputComponent class
  export class ProjectInputComponent extends AbstractComponent<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title')!;
      this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description')!;
      this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people')!;

      this.configure();
      this.renderContent();
    }

    private gatherUserInput(): [string, string, number] | void { // returns a TUPLE
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
      } else {
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
}