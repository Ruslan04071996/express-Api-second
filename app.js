const express = require('express');
const cors = require('cors');

const errorNotFound = { error: 'id.not_found' };
let nextId = 1;
const posts = [
    { id: nextId++, content: 'First post', likes: 0 },
    { id: nextId++, content: 'Second post', likes: 0 },
];
const server = express();
server.use(express.json());
server.use(cors());

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
    const index = posts.findIndex(o => o.id === body.id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }

    posts[index].content = body.content;
    res.send(posts);
});

server.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
const index = posts.findIndex( o => o.id === id)
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts.splice(index , 1);
    res.send(posts);
});
server.listen(process.env.PORT || 9999);