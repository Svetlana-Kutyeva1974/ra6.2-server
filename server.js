const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({
  json: true
}));

let notes = [{
  id: 0,
  note: 'Первая заметка..............'
},
{
  id: 1,
  note: 'Вторая заметка..............'
},
];
let nextId = 2;

const router = new Router();

router.get('/notes', async (ctx, next) => {
    ctx.response.body = notes;
});

router.post('/notes', async(ctx, next) => {
    const {id, note} = ctx.request.body;
    console.log('прищло в post запросе',ctx.request.body, id, note );

    if (id !== 0) {
        notes = notes.map(o => o.id !== id ? o : {...o, note: note});
        ctx.response.status = 204;
        return;
    }

    //notes.push({...ctx.request.body, id: nextId++, created: Date.now()});
    notes.push({...ctx.request.body, id: nextId++});
    ctx.response.status = 204;
});

router.delete('/notes/:id', async(ctx, next) => {
    const postId = Number(ctx.params.id);
    const index = notes.findIndex(o => o.id === postId);
    if (index !== -1) {
        notes.splice(index, 1);
    }
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7077;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started on port', port));

// https://www.digitalocean.com/community/tutorials/workflow-nodemon-ru#
// https://nodejsdev.ru/api/querystring/
//В querystring API считается устаревшим. 
// Хотя он все еще поддерживается, новый код должен использовать вместо него {URLSearchParams} API.

// список запущ процессов ps -la или все : ps -ax
//ps -la // Для получения основных сведений о процессах, запущенных текущем пользователем
//ps -ela  // Для всех пользователей 
// ps -a  // Базовая информация для текущего пользователя

// option package.json:
// "start": "forever  --minUptime 5000 --spinSleepTime 3000 server.js",
// "watch": "forever  --minUptime 5000 --spinSleepTime 3000 -w server.js",