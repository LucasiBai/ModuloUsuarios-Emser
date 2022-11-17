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

To clone and run this application you'll need Git, PostgreSQL, Node.js, Python^3.8 and pip installed on your computer.

- `git clone https://github.com/LucasiBai/LaCandelaBaigorria.git` to download the code.
- `cd LaCandelaBaigorria` go into the repository.
- `npm install` to install node dependencies
- `pip install -r requirements.txt` to install python dependencies.
- Create an .env file in core/settiings with:

```python
    SECRET_KEY=-!x3zqt9#4(sm0+!1wi+*4&^h*1q4tt2@%+p&td%9xnrhsro8o
    DEBUG=True

    DATABASE_URL=postgres://(postgresUser):(postgresPassword)@127.0.0.1:5432/(dbName)
```

- `python3 or py manage.py migrate` to migrate database
- `python3 or py manage.py runserver` to initialize the App.

## Information:

This is a fullstack application for a technical test for Emser.

## Deploy Link:

...

## Frontend Roots:

...

## Backend Roots:

### Admin:

- `/admin/` admin site

### User Api Roots:

- `api/users/` api-root

- `api/users/login/` user login
- `api/users/login/refresh/` user login refresh
- `api/users/reset-password/` user refresh password
- `api/users/accounts/` user list
- `api/users/accounts/(id)` user detail
- `api/users/accounts/me/` authorized user detail

### Project Api Roots

- `api/projects/` project list
- `api/projects/(id)/` project detail
- `api/projects-user/` project-user relation list
- `api/projects-user/(id)/` project-user relation detail

## Tools:

- Angular
- Angular Material
- Django
- Django Rest Framework
- Django Tests

## Example:

...
