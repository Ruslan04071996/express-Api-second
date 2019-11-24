const express = require('express');
const cors = require('cors');

const errorNotFound = { error: 'id.not_found' };
let nextId = 1;
let posts = [
    { id: nextId++, content: 'First post', likes: 0 },
    { id: nextId++, content: 'Second post', likes: 0 },
];
const server = express();
server.use(express.json());
server.use(cors());

function findPostIndexById(id) {
    return posts.findIndex(o => o.id === id)

}
server.get('/posts', (req, res) => {
    res.send(posts);
});

server.post('/posts', (req, res) => {
    const body = req.body;
    if (body.id === 0) {
        posts.push({
            id: nextId++,
            content: body.content,
            likes: 0,
        });
        res.send(posts);
        return;
    }
    const index = findPostIndexById(body.id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }

    posts[index].content = body.content;
    res.send(posts);
});
// Для удаления постов используем метод filter
server.delete('/posts/:id', (req, res) => {

    const id = Number(req.params.id);
    posts = posts.filter(o => o.id != id);
    res.send(posts);
});

// Лайки отправляются на сервер(чтобы их получить нужно обновить страницу)
server.post('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts[index].likes++;
    res.send(posts)
});

// Убирает количество лайков с нашего сервера( Лайки отправляются на сервер(чтобы их получить нужно обновить страницу))
server.delete('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);
    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts[index].likes--;
    res.send(posts)
});
server.listen(process.env.PORT || 9999);