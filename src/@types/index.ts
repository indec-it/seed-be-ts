import {Request} from 'express';
import Knex from 'knex';

export interface RequestWithUser extends Request {
  user: {
    sub: string,
    id: string,
    roles: [string],
    surname: string,
    name: string,
    password: string,
    enabled: boolean,
  };
}

export interface ModelType {
  knex: Knex;
  name: string;
  tableName: string;
  selectableProps: [string];
  timeout: number;
}
