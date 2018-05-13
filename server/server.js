const mongodb = require('mongodb');
const nconf = require('nconf');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

// Init the server
const app = new Koa();
app.use(cors());
app.use(bodyParser());

// error handling
app.use(async (ctx, next) => {
  try {
    await next();
  }
  catch (err) {
    console.log(err);

    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
})

// handle requests
app.use(async ctx => {
  const hash = ctx.request.body.hash || null;
  const url  = ctx.request.body.url || null;

  if(!hash || !url) {
    console.log('bad request', ctx.request.body);
    ctx.status = 400; //bad request
    return;
  }
  else
    ctx.status = 200;

  let result = await gdb.collection("image_hashes").findOne({hash: hash});
  if(!result) {
    console.log('new image', hash);
    ctx.body = JSON.stringify({
      validURL: true
    });
    //insert into db
    gdb.collection("image_hashes").insertOne(
      {
        hash: hash,
        url: url
      },
      function(err, res) {
        if (err)
          throw err;
        console.log("image added", hash);
      }
    );
  }
  else {
    console.log('image exists', hash);
    if(result.url === url) {
      ctx.body = JSON.stringify({
        validURL: true
      });
    }
    else {
      ctx.body = JSON.stringify({
        validURL: false
      });
    }
  }
});

// Read in keys and secrets. Using nconf use can set secrets via
// environment variables, command-line arguments, or a keys.json file.
nconf
  .argv()
  .env()
  .file({ file: './keys.json' });

// Connect to a MongoDB server provisioned over at MongoLab.
const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

let uri = `mongodb://${user}:${pass}@${host}:${port}`;
if (nconf.get('mongoDatabase')) {
  uri = `${uri}/${nconf.get('mongoDatabase')}`;
}

//global db connection
var gdb = null;

// connect to db, then run server
mongodb.MongoClient.connect(uri, (err, db) => {
  if (err) {
    throw err;
  }

  // Log database connect
  gdb = db.db(nconf.get('mongoDatabase'));
  console.log('database connected', nconf.get('mongoDatabase'));

  // Start the server
  app.listen(8080);
  console.log('Starting server, listening on port 8080...');
});
