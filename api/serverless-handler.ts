import type { Request, Response } from 'express';
import type { Express } from 'express';
import { createServer } from 'http';
import { parse } from 'url';

export function createServerlessHandler(app: Express) {
  const server = createServer(app);

  return async (req: Request, res: Response) => {
    const parsedUrl = parse(req.url!, true);
    req.url = parsedUrl.pathname || '/';
    server.emit('request', req, res);
  };
}
