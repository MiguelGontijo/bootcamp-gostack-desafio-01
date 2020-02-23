const { Router } = require('express');

const routes = new Router();

const projects = [  { id: "1", projeto: "gobarber", tasks: ["tarefa 1", "tarefa 2"] },
                    { id: "2", projeto: "radardev", tasks: ["tarefa 1", "tarefa 2"] },
                ];

/** 
 * Verifico se não existe o projeto
 */
function checkProjectNomExists(req, res, next) {
    const { index } = req.params;
    const project = projects.find(p => p.id == index);
    
    if (! project ) {
        res.status(400).json({ error: "Project not found!"});
    }
    
    return next();
}

/** 
 * Verifico se já existe o projeto
 */
function checkProjectExists(req, res, next) {
    const { id } = req.body;
    const project = projects.find(p => p.id == id);

        if ( project ) {
            res.status(400).json({ error: "Project already exists!"});
        }

        return next();
}
/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {

    console.count("Número de requisições");
  
    return next();
}
routes.use(logRequests);
/** 
 * lista todos os projetos
 */
routes.get('/projects', (req, res) => {
    return res.json( projects );
});

/** 
 * lista apenas o projeto
 */
routes.get('/projects/:index', checkProjectNomExists, (req, res) => {
    const { index } = req.params;
    const pos = projects.find(p => p.id == index );

    return res.json( pos );
});

/** 
 * cria um projeto
 */
routes.post('/projects', checkProjectExists, (req, res) => {
    const { id, projeto, tasks } = req.body;
    const project = {
        id,
        projeto,
        tasks,
    };

    projects.push(project);

    return res.json(projects);

});

/** 
 * altera apenas o projeto
 */
routes.put('/projects/:index', checkProjectNomExists, (req, res) => {
    const { index } = req.params;
    const { projeto } = req.body;
    const project = projects.find(p => p.id == index);

    project.projeto = projeto;

    return res.json(project);

});

/** 
 * altera as tasks do projeto
 */
routes.put('/projects/:index/tasks', checkProjectNomExists, (req, res) => {
    const { index } = req.params;
    const { tasks } = req.body;
    const project = projects.find(p => p.id == index);

    project.tasks.push(tasks);

    return res.json(project);

});

/** 
 * deleta o projeto
 */
routes.delete('/projects/:index', checkProjectNomExists, (req, res) =>{
    const { index } = req.params;
    const project = projects.findIndex(p => p.id == index);

    projects.splice(project, 1);

    return res.json(projects);
});

module.exports = routes;