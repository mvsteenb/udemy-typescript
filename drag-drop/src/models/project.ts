
// Project Type
export enum ProjectStatus { Active, Finished }

export class Project {
    constructor(
        public id: string,
        public title: string,
        public desc: string,
        public people: number,
        public status: ProjectStatus
    ) {
    }
}

