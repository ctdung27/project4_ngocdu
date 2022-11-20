import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('businessLogic-todos')
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
 
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
  logger.info('Create todo function called');

  const createdAt = new Date().toISOString()
  const todoId = uuid.v4()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId);

  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem);
}

// write get todos func
export async function getTodosForUser(
    userId: string
    ): Promise<TodoItem[]> {
  logger.info('Get todos for user func called');
  return todosAccess.getAllTodos(userId)
}

// write update todos func
export async function updateTodo(
  todoId: string, 
  updatedTodo: UpdateTodoRequest,
  userId: string
  ): Promise<TodoUpdate> {
  let todoUpdate: TodoUpdate = {
    ...updatedTodo
  }
  logger.info('Update todo function called');
  return todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
  ): Promise<string> {
    logger.info('create Attachment func called by user: ', userId);
    return attachmentUtils.getUploadUrl(todoId)
}

// write delete todo func
export async function deleteTodo(
  userId: string, 
  todoId: string
  ) {
  logger.info('Delete todo function called');

  return todosAccess.deleteTodoItem(userId, todoId)
}