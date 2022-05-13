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


app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  } 
  const headers = { 'Access-Control-Allow-Origin': '*', };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
  try {
    return await next();
  } catch (e) {
    e.headers = {...e.headers, ...headers};
    throw e;// проброс исключения 
    // alert(e);// throw new Error(e);
  }
  } 

  if (ctx.request.get('Access-Control-Request-Method')) {
  ctx.response.set({
  ...headers,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
  });

  if (ctx.request.get('Access-Control-Request-Headers')) {
    ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
  } 
  ctx.response.status = 204; // No content
  }
  });



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
