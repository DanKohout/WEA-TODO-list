document.addEventListener('DOMContentLoaded', async function(){
    const recievedNotes = document.getElementById("notesState")
    const taskText = document.getElementById("taskText")
    const submitBnt = document.getElementById("submitBnt")
    const listElement = document.getElementById("tasks")
    const checkedTasks = document.getElementById("onlyChecked")
    const nonCheckedTasks = document.getElementById("onlyNonChecked")
    const logOut = document.getElementById("logout")
    const jsonFormat = document.getElementById("jsonformat")
    const allTasks = document.getElementById("allTasks")
    const userName = document.getElementById("username")

    var token = ''
    loadCookieToken()
    loadStartingPage()


    /**
     * This function loads token value if is saved in cookie
     */
    function loadCookieToken() {
        let cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        if(cookieValue){
            cookieValue = cookieValue.split('=')[1]
        }
        token = cookieValue
    }

    /**
     * This function loads the starting page with all notes from database that the user has
     */
    async function loadStartingPage(){
        loadCookieToken()
        let tasksArray = await readTasks('')
        showNotesHtml(tasksArray)     
    }


    /**
     * This function process the user input and sends request to the server to create new task
     */
    submitBnt.addEventListener("click", async function(){
        loadCookieToken()
        tasksArray = []
        if(taskText.value === "") {
            recievedNotes.innerText = 'An empty note cannot be saved!' 
        }else{
            taskVal = check(taskText.value, "normalInput")
            if(!taskVal){
                recievedNotes.innerText = 'You provided dangerous input'
                recievedNotes.className = 'bg-danger' 
            }else{
                 // Adding new task
                try{
                    const task = taskText.value
                    const taskBody = {
                    "description": task, 
                    "completed": false
                }
                const taskOptions = {
                    method: 'POST', 
                    body: JSON.stringify(taskBody), 
                    headers: {
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}`
                    }
                }
                let values = fetch('/tasks', taskOptions).then(response => {
                    return response
                })
                resValue = await values
                recievedNotes.innerText = 'Task added succesfully'
                recievedNotes.className = 'bg-success'

                loadStartingPage()

                }catch(e){
                    recievedNotes.innerText = 'Task not saved'
                    recievedNotes.className = 'bg-danger'

                }
            }
        }
    })


    /**
     * This function shows all the notes from user, it creates all the buttons and input elements in
     * for loop and listen to the Events on the created elements
     */
    async function showNotesHtml(tasksArray){
        // Clearing all notes
        if(!$('#tasks').is(':empty')){
            while(listElement.firstChild){
                listElement.removeChild(listElement.lastChild)
            }
        }
        if(tasksArray){
            for (let index = 0; index < tasksArray.length; index++) {
                // creating div for task
                const taskElement = document.createElement("div")
                taskElement.classList.add("task")
                // creating checkbox element
                const taskCheckbox = document.createElement("input")
                taskCheckbox.type = "checkbox"
                taskCheckbox.classList.add("checkbox")
                if(tasksArray[index][2] === true){
                    taskCheckbox.checked = true
                }
                taskCheckbox.style = "width: 4%;margin: 2px;margin-top: 11px;"
                taskElement.appendChild(taskCheckbox)
                // creating div for task content and appending to task div
                const taskContentElement = document.createElement("div")
                taskContentElement.classList.add("content")
                taskElement.appendChild(taskContentElement)
                // creating input element and appending to content div
                const taskInputElement = document.createElement("input")
                taskInputElement.classList.add("text")
                taskInputElement.type = "text"
                taskInputElement.value = tasksArray[index][1]
                taskInputElement.setAttribute("readonly", "readonly")
                taskContentElement.appendChild(taskInputElement)
                // adding actions div
                const taskActionsElement = document.createElement("div")
                taskActionsElement.classList.add("action")
                // adding actions elements - Delete and Edit
                const taskDeleteElement = document.createElement("button")
                taskDeleteElement.classList.add("delete")
                taskDeleteElement.innerHTML = "Delete"
    
                const taskEditElement = document.createElement("button")
                taskEditElement.classList.add("edit")
                taskEditElement.innerHTML = "Edit"
                // adding elements into action element
                taskActionsElement.appendChild(taskEditElement)
                taskActionsElement.appendChild(taskDeleteElement)
                // adding action div to taskElement
                taskElement.appendChild(taskActionsElement)
                // appending taskElement to listElement
                listElement.appendChild(taskElement)
                taskText.value = ''
    
                /**
                * This function calls another function to delete the given task from database
                */
                taskDeleteElement.addEventListener('click', () => {
                    deleteTask(index, tasksArray)
                    loadStartingPage()
                })

                /**
                * This function calls another function to update the given task
                */
                taskEditElement.addEventListener('click', () => {
                    if(taskEditElement.innerText.toLowerCase() == "edit"){
                        taskInputElement.removeAttribute("readonly")
                        taskInputElement.focus()
                        taskEditElement.innerText = "Save"
                        
                    }else{
                        taskInputElement.setAttribute("readonly", "readonly")
                        taskEditElement.innerText = "Edit"
    
                        updateTaskDescription(tasksArray[index][0], taskInputElement.value)
                    }
                })
    
                /**
                * This function calls another function to change the state of the task - completed: true/false
                */
                taskCheckbox.addEventListener('change', (event) => {
                    if (event.currentTarget.checked) {
                        updateTaskCompletedVal(true, tasksArray[index][0])
                       
                    } else {
                        updateTaskCompletedVal(false, tasksArray[index][0])
                        
                    }
                })
            }
        }
    }


    /**
     * This function sends request to the server to log out the user
     */
    logOut.addEventListener('click', async function(){
        try{
            const taskOptions = {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                }
            }
            let values = fetch('/users/logout', taskOptions).then(response => {
                if (response.status === 500){
                    throw new Error("server error")
                }
                return response
            })
            let response = await values
            if(!$('#tasks').is(':empty')){
                while(listElement.firstChild){
                    listElement.removeChild(listElement.lastChild)
                }
            }
            recievedNotes.innerText = 'Log out was succesful'
            recievedNotes.className = 'bg-success'
            document.cookie = 'user=; Max-Age=-99999999;'
            window.location.href = "/login"
        }catch(e){
            recievedNotes.innerText = 'Log out was not succesful' 
            recievedNotes.className = 'bg-danger'
 
        }
    })


    /**
     * This function shows all the tasks of the user
     */
    allTasks.addEventListener('click', async function(){
        loadStartingPage()
    })


    /**
     * This function shows only checked tasks
     */
    checkedTasks.addEventListener('click', async function(){
        let tasksArray = await readTasks('?completed=true')
        showNotesHtml(tasksArray)
        
        recievedNotes.innerText = ''
    })


    /**
     * This function shows only non checked tasks
     */
    nonCheckedTasks.addEventListener('click', async function(){
        let tasksArray = await readTasks('?completed=false')
        showNotesHtml(tasksArray)
        
        recievedNotes.innerText = ''        
    })

    /**
     * This function opens new window with JSON formated data
     */
    jsonFormat.addEventListener('click', function(){
        window.open('https://kind-plum-goshawk-cuff.cyclic.app/json', '_blank')
        //console.log('process.env.CYCLIC_URL: ',process.env.CYCLIC_URL)
        //window.open(process.env.CYCLIC_URL+'/json', '_blank')
        //window.open('http://localhost:3000/json', '_blank')
    })

    /**
     * This function sends request to the server to delete given task
     */
    async function deleteTask(index, tasksArray){
        const taskOptions = {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        }
        try{
            let values = fetch('/tasks/'+tasksArray[index][0], taskOptions).then(response => {
                return response.json()
            })
            let response = await values
            recievedNotes.innerText = 'Task was deleted succesfully'
            recievedNotes.className = 'bg-success'
            loadStartingPage()
        }catch(e){
            recievedNotes.innerText = 'Task not deleted'
            recievedNotes.className = 'bg-danger'
        }
    }
    
    /**
     * This function sends request to server to update task state
     */
    async function updateTaskCompletedVal(val, id){
        const taskBody = {
            "completed": val, 
        }
        const taskOptions = {
            method: 'PATCH', 
            body: JSON.stringify(taskBody), 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        }
        try{
            fetch('/tasks/'+id, taskOptions).then(response => {
            })
            recievedNotes.innerText = 'Task was updated succesfully'
            recievedNotes.className = 'bg-success'
        }catch(e){
            recievedNotes.innerText = 'Task not updated'
            recievedNotes.className = 'bg-danger'

        }
    }

    /**
     * This function sends request to server to update task description
     */
    async function updateTaskDescription(id, text){
        const taskBody = {
            "description": text, 
        }
        const taskOptions = {
            method: 'PATCH', 
            body: JSON.stringify(taskBody), 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        }
        try{
            fetch('/tasks/'+id, taskOptions).then(response => {})
            recievedNotes.innerText = 'Task was updated succesfully'
            recievedNotes.className = 'bg-success'

        }catch(e){
            recievedNotes.innerText = 'Task not updated'
            recievedNotes.className = 'bg-danger'

        }
        

    }

    /**
     * This function sends request to server get the required tasks (all, checked, non checked)
     */
    async function readTasks(completedVal){
        try{
            const taskOptions = {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                }
            }
            let values = fetch('/tasks'+completedVal, taskOptions).then(response => {
                if(response.status === 401){
                    throw new Error("Unauthorized")
                }if (response.status === 500) {
                    throw new Error(response)
                } else {
                    return response.json()
                }
                
            }).then(data => {
                array = new Array(data.length)
                counter = 0
                data.forEach(item => {
                    id = item._id
                    description = item.description
                    completed = item.completed
                    array[counter] = [id, description, completed]
                    counter += 1
                })
                return array 
            })
            let result = await values;
            tasksArray = result
            // if I am able to load tasks, than user is logged and i can show his name
            if(document.cookie.split('; ').find(row => row.startsWith('user='))){
                var userCookie = document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1]
                userName.innerText = "Logged user: "+ userCookie
            }
            return tasksArray
        }catch(e){
            recievedNotes.innerText = 'There is problem with loading your notes -> '+e
            recievedNotes.className = 'bg-danger'

        }  
        }
        

})

/**
* This function checks if the given values are not do not contain dangerous code
 */
function check(input, type) {
    if(type === "email"){
        if(validateEmail(input)){
            return true
        }else{
            return false
        }
    }else if(type === "password" || type === "normalInput") {
        if(!input.includes("eval") && !input.includes("setTimeout") && !input.includes("setInterval") && !input.includes("new Function") && !input.includes("script")){
            if(type === "password"){
                if(input.length > 6){
                    if(!input.toLowerCase().includes("password")){
                        return true
                    }
                }else{
                    return false
                }
            }else{
                return true
            }
        }else{
            return false
        }
    
    }
}

/**
* This function checks if the given value is valid email
*/
function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }










