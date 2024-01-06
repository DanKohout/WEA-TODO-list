document.addEventListener('DOMContentLoaded', function(){
    nameField = document.getElementById("name")
    emailField = document.getElementById("email")
    passwordField = document.getElementById("password")
    statusMessage = document.getElementById("signUpState")
    btn = document.getElementById("SignUp")

    var token = ''
    var user

    /**
     * This function process user input and calls function with request to the server for creating new user
     */
    btn.addEventListener("click", async function(){
        if(nameField.value == "" || emailField.value == "" || passwordField.value == ""){
            statusMessage.innerText = "You have to fill all the fields!"
            statusMessage.className = 'bg-danger'
        }else{
            let nameVal = check(nameField.value, "normalInput")
            let emailVal = check(emailField.value, "email")
            let passwdVal = check(passwordField.value, "password")
            if(!emailVal || !passwdVal || !nameVal){
                statusMessage.innerText = "You provided incorrect input"
                statusMessage.className = 'bg-danger'
            }else{
                try{
                    let result = await signUpFunc(nameField.value, emailField.value, passwordField.value)
                    token = result[0]
                    user = result[1].name
                    statusMessage.innerText = "Succesfully signed up!"
                    statusMessage.className = 'bg-success'
                    if(!token && !user){
                        throw new Error()    
                    }
                    document.cookie = "user=" + user + "; SameSite=None; max-age=86400; Secure"
                    document.cookie = "token=" + token + "; SameSite=Strict; max-age=86400; Secure";
                    window.location.href = "/notes"
                }catch(e){
                    statusMessage.innerText = "Failed to sign you up"
                    statusMessage.className = 'bg-danger'
                }
            }  
        }
    })

    /**
     * This function sends request to the server to create new user
     */
    async function signUpFunc(name, email, passwd) {
        const body = {
            "name": name,
            "email": email,
            "password": passwd
        }
        const options = {
            method: 'POST', 
            body: JSON.stringify(body), 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const values = fetch('/users', options).then(response => {
            return response.json()
        }).then(data => {
            token = data.token
            user = data.user
            return [token, user]
        })
        let result = await values;
        return result
    }
    
})
/**
* This function checks if there is no danger input, it validates if the given input is email or if it does not contain dangerous code
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
* This function checks if given value is email
*/
function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }



