const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');

app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  fs.readFile('projects.json','utf-8', function(err, data){
    if(err){
      console.log('err : ', err);
      return;
    }
    // console.log("data: ", data);
    let projects = JSON.parse(data);
    // console.log("projects: ", projects);
    res.render('home',{
      projects:projects
    });
  });
});

app.get('/demo-day', (req, res) => {
  res.render('dday');
});

app.get('/students', (req, res) => {
  // console.info('@students', students)
  fs.readFile('students.json','utf-8', function(err, data){
    if(err){
      console.log('err : ', err);
      return;
    }
    let students = JSON.parse(data);
    // console.log('@students : ', students);
    res.render('students',{
      students:students
    });
  });
});

app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;
  fs.readFile('students.json','utf-8', function(err, data){
    if(err){
      console.log('err : ', err);
      return;
    }
    let students = JSON.parse(data);
    let student = searchProject(students, studentId);
    res.render('student',{
      student:student
    });
  });
});

app.get('/projects', function(req,res) {
  fs.readFile('projects.json','utf-8', function(err, data){
    if(err){
      console.log('err : ', err);
      return;
    }
    // console.log("data: ", data);
    let projects = JSON.parse(data);
    // console.log("projects: ", projects);
    res.render('projects',{
      projects:projects
    });
  });
});
 
app.get('/projects/:id', function(req,res) {
let projectId = req.params.id;
fs.readFile('projects.json', 'utf-8', function(err, data){
  if(err){
    console.log('err /projects/:projectName : ', err);
    return;
  }
  let projects = JSON.parse(data);
  let project = searchProject(projects, projectId);
  // console.log('project retourner : ', project);

  fs.readFile('students.json', 'utf-8', function(err, data){
    if(err){
      console.log('err students.json: ', err);
      return;
    }
    let teamProject =[];
    let students = JSON.parse(data);
    // console.log('err students.json : ', students);
    for(let i=0;i<project.teamId.length;i++){
      teamProject.push(searchProject(students, project.teamId[i]));
    }
    console.log('teamProject : ', teamProject);
    res.render('project', {
      project: project,
      team: teamProject
    });
  });
});
});

function searchProject(table, id){
  // console.log(' table : ', table);
  // console.log(' id : ', id); 
  for(let i=0; i < table.length; i++){
    if(table[i].id == id){
      return table[i];
    }
  } 
};

app.get('/*', (req,res) => {
  res.send('404');
});

app.listen(port, (req, res) => {
  console.info("server started on port", port);
});
