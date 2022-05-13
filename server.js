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
    console.log('пришло в post запросе', ctx.request, ctx.request.body);
    notes.push({...ctx.request.body, id: nextId++});
    console.log('получили массив на выходе запросе',notes );
    //ctx.response.body = notes;//? не нужно
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
