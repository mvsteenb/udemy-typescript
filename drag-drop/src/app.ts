
/// <reference path='components/project-input.ts' />
/// <reference path='components/project-list.ts' />

namespace App {

  new ProjectInputComponent();
  new ProjectListComponent('active');
  new ProjectListComponent('finished');

}