// tslint:disable:max-line-length
import path from 'path';
import fs from 'fs';
import {Response} from 'express';

class Errors {
    public static sendError(res: Response) {
        const img = fs.readFileSync(path.resolve(__dirname, '..', '..', 'public/U3DoNsS.jpg'));
        res.writeHead(401, {'Content-Type': 'text/html'});
        res.write('<html><body style="background-color: #000"><h2 style="color: #fff; text-align: center; left: 0, right: 0">Entiendo que quer&eacute;s ver lo que hay pero necesitas permisos especiales</h2>');
        res.write(`<img style="margin-left: 35%" width="400px" src="data:image/jpeg;base64,${Buffer.from(img).toString('base64')}`);
        return res.end('"/></body></html>');
    }

    public static send404(res: Response) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('<html><head><link rel="icon" type="image/png" href="/public/kaizen.png" sizes="64x64"></head>');
        res.write('<body style="background-color: #000"><h2 style="margin-top: 10%; color: #fff; text-align: center; left: 0, right: 0">Encontraste algo Oculto......</h2>');
        res.write('<h4 style="color: #fff; text-align: center; left: 0, right: 0">404 P&aacute;gina no encontrada</h4>');
        return res.end('</body></html>');
    }
}

export default Errors;
