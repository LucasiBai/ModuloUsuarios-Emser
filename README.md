<h1 align="center">
  <br>
  <a href="http://www.emser.net/">
  <img src="https://media.cylex.com.ar/companies/1111/5565/logo/logo.jpg" alt="Emser" width="200"></a>
  <br>
  EMSER TEST
  <br>
</h1>
<h4 align="center">A FULL STACK USER MODULE FOR EMSER USING <a href="https://angular.io/">ANGULAR</a> and <a href="https://www.djangoproject.com/">DJANGO</a>.</h4>

## How to Use:

To clone and run this application you'll need AngularCLI, Git, PostgreSQL, Node.js, Python^3.8 and pip installed on your computer.

- `git clone https://github.com/LucasiBai/LaCandelaBaigorria.git` to download the code.
- `cd LaCandelaBaigorria` go into the repository.
- `cd build` to go to the frontend package.
- `npm install` to install node dependencies.
- `ng serve` to initialize the frontend app.
- `cd ..` to go back.
- `pip install -r requirements.txt` to install python dependencies.
- Create an .env file in core/settiings with:

```python
    SECRET_KEY=-!x3zqt9#4(sm0+!1wi+*4&^h*1q4tt2@%+p&td%9xnrhsro8o
    DEBUG=True

    DATABASE_URL=postgres://(postgresUser):(postgresPassword)@127.0.0.1:5432/(dbName)
```

- `python3 or py manage.py migrate` to migrate database
- `python3 or py manage.py runserver` to initialize the backend app.

## Information:

This is a fullstack application for a technical test for Emser.

## Deploy Link:

https://emser-modulo-usuarios.netlify.app

## Frontend Roots:

### Tables Roots:

- `tables/users` to go to the user tables
- `tables/projects` to go to the projects tables
- `tables/projects-users` to go to the relations tables

### User Roots:

- `/login` to login
- `/home` to see the user table

## Backend Roots:

### Admin:

- `/admin/` admin site

### User Api Roots:

- `api/users/` api-root

- `api/users/login/` user login
- `api/users/login/refresh/` user login refresh
- `api/users/reset-password/` user refresh password
- `api/users/accounts/` user list
- `api/users/accounts/(id)/` user detail
- `api/users/accounts/me/` authorized user detail

### Project Api Roots

- `api/projects/` project list
- `api/projects/(id)/` project detail
- `api/projects-users/` project-user relation list
- `api/projects-users/(id)/` project-user relation detail

## Tools:

- Angular
- Bootstrap
- Django
- Django Rest Framework
- Django Tests

## Example:

...
