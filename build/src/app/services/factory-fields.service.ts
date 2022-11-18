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

          as: 'Author',
          type: 'text',
        },
        {
          field: 'project',

          as: 'Project',
          type: 'text',
        },
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
    } else {
      return 'users/accounts/';
    }
  }
}
