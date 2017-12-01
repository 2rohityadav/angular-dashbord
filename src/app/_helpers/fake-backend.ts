import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (_backend: MockBackend, _options: BaseRequestOptions) => {
    // array in local storage for registered users
    const users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    // config fake backend
    _backend.connections.subscribe( (_connection: MockConnection) => {
      // wrap in timeout to simulate server api call
      setTimeout( () => {


        // authenticate
        if (_connection.request.url.endsWith('/api/authenticate') && _connection.request.method === RequestMethod.Post) {
          // get the parameters from the post request
          const params = JSON.parse(_connection.request.getBody());

          // find if any user matches login credentials
          const filteredUsers = users.filter( user => {
            return user.username === params.username && user.password === params.password;
          });

          if (filteredUsers.length) {
            // if login details are valid return 200 OK with user details and fake jwt token
            const user = filteredUsers[0];
            _connection.mockRespond(new Response(new ResponseOptions({
              status: 200,
              body: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
              }
            })));
          } else {
            // else return 400 bad request
            _connection.mockError(new Error('Username or password is incorrect'));
          }
        }

        // get users
        if (_connection.request.url.endsWith('/api/users') && _connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
          if (_connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
              _connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users })));
          } else {
              // return 401 not authorised if token is null or invalid
              _connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
      }

      // get user by id
      if (_connection.request.url.match(/\/api\/users\/\d+$/) && _connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (_connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
            // find user by id in users array
            const urlParts = _connection.request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1], 10);
            const matchedUsers = users.filter(u => {
               return u.id === id;
              });
            const user = matchedUsers.length ? matchedUsers[0] : null;

            // respond 200 OK with user
            _connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
        } else {
            // return 401 not authorised if token is null or invalid
            _connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }
    }

        // create user
        if (_connection.request.url.endsWith('/api/users') && _connection.request.method === RequestMethod.Post) {
          // get the new user from the post body
          const newUser = JSON.parse(_connection.request.getBody());

          // validation
          const duplicateUser = users.filter(user => {
            return user.username === newUser.username;
          }).length;

          // save new user
          newUser.id = users.length + 1;
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          // respond 200 ok
          _connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
        }


        // delete user
        if (_connection.request.url.match(/\/api\/users\/\d+$/) && _connection.request.method === RequestMethod.Delete) {
          // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
          if (_connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
              // find user by id in users array
              const urlParts = _connection.request.url.split('/');
              const id = parseInt(urlParts[urlParts.length - 1], 10);
              for (let i = 0; i < users.length; i++) {
                  const user = users[i];
                  if (user.id === id) {
                      // delete user
                      users.splice(i, 1);
                      localStorage.setItem('users', JSON.stringify(users));
                      break;
                  }
              }

              // respond 200 OK
              _connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
          } else {
              // return 401 not authorised if token is null or invalid
              _connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
          }
      }



      }, 500);
    });

    return new Http(_backend, _options);
  },
  deps: [MockBackend, BaseRequestOptions]
};
