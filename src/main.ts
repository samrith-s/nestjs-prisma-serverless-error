import { Server } from 'http';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, proxy } from '@vendia/serverless-express';
import { eventContext } from '@vendia/serverless-express/middleware';
import { Handler, Context } from 'aws-lambda';
import * as express from 'express';
import { AppModule } from './app.module';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;
let count = 0;

async function bootstrapServer(module: any): Promise<Server> {
  if (!cachedServer) {
    console.log('Bypassed server cache');
    const expressApp = express();
    const nestApp = await NestFactory.create(
      module,
      new ExpressAdapter(expressApp),
    );
    nestApp.enableCors();
    nestApp.use(eventContext());
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }

  count += 1;
  console.log(
    `[${module?.name || 'Unknown module'}]`,
    'Server bootstrapped',
    count,
    'times.',
  );
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  const server = await bootstrapServer(AppModule);
  return proxy(server, event, context, 'PROMISE').promise;
};
