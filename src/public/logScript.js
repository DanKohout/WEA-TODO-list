document.addEventListener('DOMContentLoaded', function(){
    emailField = document.getElementById("email")
    passwordField = document.getElementById("password")
    statusMessage = document.getElementById("logInState")
    btn = document.getElementById("LogIn")

    /**
     * This function process user input and sends request to the server to log in user
     */
    btn.addEventListener("click", async function(){   
        if(emailField.value == "" || passwordField.value == ""){
            statusMessage.innerText = "You have to fill all the fields!"
            statusMessage.className = 'bg-danger'   
        }else{
            let emailVal = check(emailField.value, "email")
            let passwdVal = check(passwordField.value, "password")
            if(!emailVal || !passwdVal){
                statusMessage.innerText = "You provided incorrect input"
                statusMessage.className = 'bg-danger'
            }else{
                try{
                    let result = await logInFunc(emailField.value, passwordField.value)
    
                    token = result[0]
                    user = result[1].name
                    
                    statusMessage.innerText = "Succesfully logged in!"
                    statusMessage.className = 'bg-success'
                    if(!token && !user){
                        throw new Error()   
                    }
                    document.cookie = "user=" + user + "; SameSite=None; max-age=86400; Secure"
                    document.cookie = "token=" + token +"; SameSite=Strict; max-age=86400; Secure";
                    window.location.href = "/notes"
                }catch(e){

                    statusMessage.innerText = "Failed to log you in"
                    statusMessage.className = 'bg-danger'
                }
            }  
        }
    })

    /**
     * This function sends request to the server to log in user
     */
    async function logInFunc(email, passwd) {
        const body = {
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
    
        const values = fetch('/users/login', options).then(response => {
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
* This function checks if given input is ok and does not contain dangerous code
*/
function check(input, type) {
    if(type === "email"){
        if(validateEmail(input)){
            return true
        }else{
            return false
        }
    }else if(type === "password") {
        if(input.length > 6){
            if(!input.includes("eval") && !input.includes("setTimeout") && !input.includes("setInterval") && !input.includes("new Function") && !input.includes("script")){
                if(!input.toLowerCase().includes("password")){
                    return true
                }else{
                    return false
                }
            }else{
                return false
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