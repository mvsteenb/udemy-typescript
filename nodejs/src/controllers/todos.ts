import {RequestHandler} from 'express';
import {Todo} from '../models/todo';

const TODOS: Todo[] = [];

export const createTodo: RequestHandler = (req, res, next) => {
    const bodyString = (req.body as {text: string});
    const text = bodyString.text;
    const newTodo = new Todo(Math.random().toString(), text);

    TODOS.push(newTodo);

    res.status(201).json({message: 'Created the todo', createdTodo: newTodo});
};

export const getTodos : RequestHandler = (req, res, next) => {
    res.json({todos: TODOS});
}

export const updateTodo : RequestHandler<{id: string}> = (req, res, next) => {
    const id = req.params.id;
    const bodyString = (req.body as {text: string});
    const text = bodyString.text;

    const idx = TODOS.findIndex(t => t.id === id);
    if (idx < 0) {
        throw new Error("Could not find TODO");
    }

    TODOS[idx] = new Todo(TODOS[idx].id, text);
    res.status(201).json({message: 'TODO updated', updatedTodo: TODOS[idx]});
}

export const deleteTodo : RequestHandler<{id: string}> = (req, res, next) => {
    const id = req.params.id;
    const bodyString = (req.body as {text: string});
    const text = bodyString.text;

    const idx = TODOS.findIndex(t => t.id === id);
    if (idx < 0) {
        throw new Error("Could not find TODO");
    }

    TODOS.splice(idx, 1);

    res.status(201).json({message: 'TODO deleted !'});
}