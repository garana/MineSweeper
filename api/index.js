System.register(["express", "process", "path", "body-parser", "./Handlers"], function (exports_1, context_1) {
    "use strict";
    var express, process, path, bodyParser, Handlers_1, app, port;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (express_1) {
                express = express_1;
            },
            function (process_1) {
                process = process_1;
            },
            function (path_1) {
                path = path_1;
            },
            function (bodyParser_1) {
                bodyParser = bodyParser_1;
            },
            function (Handlers_1_1) {
                Handlers_1 = Handlers_1_1;
            }
        ],
        execute: function () {
            app = express();
            port = process.env.PORT || 80;
            app.listen(port);
            console.log(`MineSweeper listening on ${port}`);
            app.use(bodyParser.json()); // for parsing application/json
            app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
            app.use(express.static(path.join(__dirname + '/../build', 'public')));
            app.route('/game')
                .post(Handlers_1.createBoard)
                .get(Handlers_1.showBoard);
            app.route('/click')
                .post(Handlers_1.processClick);
            app.route('/flag')
                .post(Handlers_1.processFlag);
        }
    };
});
//# sourceMappingURL=index.js.map