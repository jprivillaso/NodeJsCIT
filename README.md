# NodeJs Challenges
Exercícios de DOJOS para aprender NodeJs

## Instruções para Instalação

1. Instale as dependencias

```ssh
npm install
mkdir config
```
    
2. Crie um arquivo config.js dentro da pasta config com o seguinte formato

```js
module.exports = {
    api: {
        user: 'user',
        password: 'password'
    },
    server: {
        host: 'localhost',
        port: 8080
    },
    consign: {
        verbose: false
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 0
    }
};
```

3. Instale Redis. 

- [Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis) 
- [Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04) 

3. Execute a aplicação

```ssh
node app.js
```

4. Abra o browser no endereço http://localhost:8080/people

5. Enjoy