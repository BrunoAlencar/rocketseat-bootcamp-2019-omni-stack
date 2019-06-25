const express = require('express')
const server = express()

server.use(express.json())

const projects = [
    {
        id: '1123',
        title: 'Project 1',
        tasks: [
            'task1',
            'task2'
        ]
    },
    {
        id: '222',
        title: 'Project 2',
        tasks: [
            'task3',
            'task4'
        ]
    }
]

server.post('/projects', (req, res) => {
    const { id, title } = req.body
    try {
        projects.push({
            id,
            title,
            tasks: []
        })

        res.status(401).json({ message: 'Created with success!' })

    } catch ({ message: error }) {
        res.status(400).json({ error })
    }
})

server.get('/projects', (req, res) => {
    try {
        res.json(projects)
    } catch ({ message: error }) {
        res.status(500).send({ error })
    }
})

server.put('/projects/:id', (req, res) => {
    const { id } = req.params
    try {
        const projectIndex = projects.findIndex((project) => project.id == id)
        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' })
        }
        projects[projectIndex] = {
            title: req.body.title
        }
        res.json(projects[projectIndex])
    } catch ({ message: error }) {
        res.status(500).send({ error })
    }
})

server.delete('/projects/:id', (req, res) => {

})

server.post('/projects/:id/tasks', (req, res) => {

})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})