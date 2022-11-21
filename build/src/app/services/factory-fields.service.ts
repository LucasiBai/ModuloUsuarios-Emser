import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FactoryFieldsService {
  constructor() {}
  public getFields(category: string): any[] {
    if (category === 'projects') {
      return [
        { field: 'id', as: 'Id', type: null },
        { field: 'name', as: 'Name', type: 'text' },
      ];
    } else if (category === 'projects-users') {
      return [
        { field: 'id', as: 'Id', type: null },
        {
          field: 'author',
          child: true,
          childName: 'username',
          as: 'Author',
          type: 'text',
        },
        {
          field: 'project',
          child: true,
          childName: 'name',
          as: 'Project',
          type: 'text',
        },
      ];
    } else if (category === 'users') {
      return [
        { field: 'id', as: 'Id', type: null },
        { field: 'username', as: 'Username', type: 'text' },
        { field: 'first_name', as: 'First Name', type: 'text' },
        { field: 'last_name', as: 'Last Name', type: 'text' },
        { field: 'user_type', as: 'Type', type: 'radio' },
      ];
    } else {
      return [];
    }
  }
  public getCreateFields(category: string) {
    if (category === 'projects') {
      return [
        { field: 'id', as: 'Id', type: null },
        { field: 'name', as: 'Name', type: 'text' },
      ];
    } else if (category === 'projects-users') {
      return [
        { field: 'id', as: 'Id', type: null },
        {
          field: 'author',
          child: true,
          childName: 'username',
          as: 'Author',
          type: 'text',
        },
        {
          field: 'project',
          child: true,
          childName: 'name',
          as: 'Project',
          type: 'text',
        },
      ];
    } else if (category === 'users') {
      return [
        { field: 'email', as: 'Email', type: 'email' },
        { field: 'username', as: 'Username', type: 'text' },
        { field: 'password', as: 'Password', type: 'password' },
        { field: 'repeatPassword', as: 'Repeat Password', type: 'password' },
        { field: 'first_name', as: 'First Name', type: 'text' },
        { field: 'last_name', as: 'Last Name', type: 'text' },
        { field: 'user_type', as: 'Type', type: 'radio' },
      ];
    } else {
      return [];
    }
  }
  public getTitle(category: string) {
    if (category === 'projects') {
      return 'Projects';
    } else if (category === 'projects-users') {
      return 'Projects Users';
    } else {
      return 'Users';
    }
  }
  public getUrl(category: string) {
    if (category === 'projects') {
      return 'projects/';
    } else if (category === 'projects-users') {
      return 'projects-users/';
    } else if (category === 'users') {
      return 'users/accounts/';
    } else {
      return 'users/accounts/';
    }
  }
}
