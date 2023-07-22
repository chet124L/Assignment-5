/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Chester Gil Balbuena ID: 113088223 Date: 2023-07-22
* 
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path")
const collegeData = require("./modules/collegeData.js");
const { isNull } = require("util");
const app = express();
const exphbs = require("express-handlebars");

var zeroValMsg = {
    message:"no results"
    } 
    
app.use(express.static("public"))
//folder that contains home/about/htmlDemo.html
app.use(express.static("./views"))
app.use(express.urlencoded({ extended: true }) )
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

// // Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine(
    { 
        extname: ".hbs",
        helpers: {
            navLink: function(url, options){
                return '<li' + 
                    ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }
        }
    }));
app.set("view engine", ".hbs");

collegeData.initialize().then(
    success => { console.log(`Successfully initialized Object`) 

    //setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, ()=>{
        console.log("server listening on port: " + HTTP_PORT)
    })

    // Query String to read data
    //http://localhost:8080/students?course=value
    app.get("/students", (req,res)=>{

        if ((req.query.course)) {
            //getStudentsByCourse
            collegeData.getStudentsByCourse(req.query.course).then(
                student => { res.send(student) }     
            ).catch(
                // error => { res.send({
                //     message:"no results"
                //     } )
                // }
                error => { res.render("students", {
                    message:"no results"
                    })        
                }
            )
        }else{
            
            //getAllStudents
            collegeData.getAllStudents().then(
                // student => { res.send(student) }
                student => { res.render("students", {
                    students: student
                   })
               }                      
            ).catch(
                // error => { res.send(zeroValMsg)
                error => { res.render("students", {
                    message:"no results"
                    })        
                }
            )
        }
    });

    // //http://localhost:8080/tas
    // app.get("/tas", (req,res)=>{

    //     //getTAs
    //     collegeData.getTAs().then(
    //         student => { res.send(student) }
    //     ).catch(
    //         error => { res.send(zeroValMsg)
    //     })
    // });

    //http://localhost:8080/courses
    app.get("/courses", (req,res)=>{

        //getTAs
        collegeData.getCourses().then(
            // courses => { res.send(courses) }
            courses => { res.render("courses", {courses: courses}); }
            
        ).catch(
            // error => { res.send(zeroValMsg)}
            error => { res.render("courses", {
                message:"no results"
               })        
            }    
        )
    });

    //http://localhost:8080/student/num
    app.get("/student/:num", (req,res)=>{
 
        //getStudentByNum
        collegeData.getStudentByNum(req.params.num).then(
            // student => { res.send(student) }
            student => { res.render("student", { student: student }); }
        ).catch(
            error => { console.log(error)
        })
    });
        
    //http://localhost:8080/course/id
    app.get("/course/:id", (req,res)=>{
 
        //getCourseById
        collegeData.getCourseById(req.params.id).then(
            course => { res.render("course", { course: course }); }
            // course => {  res.send(course) }
        ).catch(
            error => {  res.render("course", { message: "no result" }); }
        )
    });

    //http://localhost:8080/students/add
    app.post("/students/add", (req,res)=>{
 
        //addStudent
        collegeData.addStudent(req.body).then(
            student => { res.redirect("/students") }
        ).catch(
            error => { console.log(error)
        })
    });

    //http://localhost:8080//student/update
    app.post("/student/update", (req, res) => {
        // check if passed data is correct
        console.log(req.body);  
        //updateStudent
        collegeData.updateStudent(req.body).then(
            student => { 
                res.redirect("/students") 
            }
        ).catch(
            error => { console.log(error)
        })
    });
    
    //http://localhost:8080/
    app.get("/", (req, res) => {
        // res.sendFile(path.join(__dirname, "/views/home.html"))
        res.render('home', {
            // Default is main.hbs
            // layout: true // do not use the default Layout (main.hbs)
        });
    })

    //http://localhost:8080/about
    app.get("/about", (req, res) => {
        // res.sendFile(path.join(__dirname, "/views/about.html"))
        res.render('about', {
            // Default is main.hbs
            // layout: true // do not use the default Layout (main.hbs)
        });
    })

    //http://localhost:8080/htmlDemo
    app.get("/htmlDemo", (req, res) => {
        // res.sendFile(path.join(__dirname, "/views/htmlDemo.html"))
        res.render('htmlDemo', {
            // Default is main.hbs
            // layout: true // do not use the default Layout (main.hbs)
        });
    })
    
    //http://localhost:8080/student/add
    app.get("/students/add", (req, res) => {
        // res.sendFile(path.join(__dirname, "/views/addStudent.html"))
        res.render('addStudent', {
            // Default is main.hbs
            // layout: true // do not use the default Layout (main.hbs)
        });
    })

    app.use((req, res) => {
        res.status(404).sendFile(path.join(__dirname, "views", "404-error.gif"));
      });

}).catch(
    error => {console.log(error)
})

